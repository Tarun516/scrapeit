from dotenv import load_dotenv
import os
from pinecone import Pinecone
import google.generativeai as genai
from langchain_groq import ChatGroq


# Load environment variables
load_dotenv()
groq_api_key = os.environ.get("GROQ_API_KEY")
pinecone_api_key = os.environ.get("PINECONE_API_KEY")
gemini_api_key = os.environ.get("GEMINI_API_KEY")
model = genai.GenerativeModel("gemini-1.5-flash")


# Configure Pinecone and Gemini
pc = Pinecone(api_key=pinecone_api_key)
index = pc.Index("scrapeit")
genai.configure(api_key=gemini_api_key)

# Initialize ChatGroq with LLaMA for responses
llm = ChatGroq(
    model="llama3-70b-8192",
    api_key=groq_api_key,
    temperature=0.0,
    max_retries=2,
)



def generate_embedding(content):
    max_length = 9000

    content_chunks = []
    while len(content) > max_length:
        split_index = content.rfind(' ', 0, max_length)
        if split_index == -1:
            split_index = max_length
        content_chunks.append(content[:split_index])
        content = content[split_index:].strip()

    if content:
        content_chunks.append(content)

    for i, chunk in enumerate(content_chunks):
        # Generate embedding with Gemini model
        result = genai.embed_content(
            model="models/text-embedding-004",
            content=chunk,
            task_type="retrieval_document",
            title=f"Embedding of chunk {i + 1}"
        )

        embedding = result['embedding']

        metadata = {
            "title": f"Chunk {i + 1}",
            "source": "scraped_website",
            "content": chunk
        }

        index.upsert([(f"doc-{i+1}", embedding, metadata)])
        print(f"Upserted embedding for chunk {i + 1}: {str(embedding)[:50]} ... TRIMMED")

def parse_scraped_data(scraped_data):
    prompt = f"""
    Parse and summarize the following scraped web content:

    {scraped_data}

    Instructions:
    1. Remove irrelevant information, ads, and boilerplate text.
    2. Organize content into coherent paragraphs or sections.
    3. Preserve key facts, figures, and important quotes.
    4. Maintain original meaning and context.
    5. Use clear and concise language.
    6. Include relevant headings or subheadings.
    7. Ensure each paragraph can stand alone for embedding.
    8. Extract and include the title and meta description if available.
    9. Add a brief summary at the beginning.

    Format the output as:
    Title: [Extracted title]
    Summary: [Brief overview]
    Content:
    [Organized and parsed content]
    """
    response = model.generate_content(prompt)
    parsed_content = response.text
    print(parsed_content)
    generate_embedding(parsed_content)
    return parsed_content

 

def generate_query_embedding(query):
    # Generate query embedding with Gemini
    result = genai.embed_content(
        model="models/text-embedding-004",
        content=query,
        task_type="retrieval_query"
    )

    embedding = result['embedding']
    print(f"Generated Embedding for query: {str(embedding)[:50]} ... TRIMMED")
    return embedding


def search_similar_content(query_embedding, top_k=2):
    result = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_values=False,
        include_metadata=True
    )

    print(f"Top {top_k} results for the query:")
    for match in result['matches']:
        print(f"ID: {match['id']}")
        print(f"Score: {match['score']}")
        print(f"Metadata: {match['metadata']}")
        print(f"Content Summary: {match['metadata'].get('summary', 'No summary available')}")
        print("\n")

    return result['matches']


def llm_query_response(query, context):
    print(f"length of the context is {len(context)}")
    print(f"the context is {context}")
    prompt = f"""
    User query: {query}

    Context:
    {context}

    Instructions:
    1. Analyze the user's query and the provided context.
    2. Provide a detailed, accurate response based primarily on the given context.
    3. If the context doesn't contain enough information, state that clearly.
    4. Use a clear and concise writing style.
    5. If appropriate, structure the response with subheadings or bullet points.

    Response:
    """
    
    response = llm.invoke([("system", prompt)])
    return response.content

#def llm_query_response(query, context):
 #   return {"query": query, "response": "Dummy LLM response"}
