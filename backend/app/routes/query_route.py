# query_route.py
from flask import Blueprint, request, jsonify
from app.services.llm_integration import (
    generate_query_embedding,
    search_similar_content,
    llm_query_response,
)
from  app.routes.auth_route import auth_required

query_blueprint = Blueprint("query", __name__)
@query_blueprint.route("/query", methods=["POST"])
#@auth_required 

def query():
    data = request.json
    query = data.get("query")
   # user_id = request.user_id

    # Check if query and user_id are present
    if not query:
        return jsonify({"error": "Query is required"}), 400
   # if not user_id:
       # return jsonify({"error": "User ID is required"}), 400

    try:
        # Step 1: Generate the embedding for the query
        print("Generating query embedding...")
        query_embedding = generate_query_embedding(query)

        # Check if query_embedding is None
        if query_embedding is None:
            return jsonify({"error": "Query embedding is None"}), 500

        # Step 2: Perform the search operation to get similar content
        print("Searching for similar content...")
        matches = search_similar_content(query_embedding)

        # Check if matches is None or empty
        if matches is None or len(matches) == 0:
            return jsonify({"error": "No matches found"}), 500

        # Step 3: Extract the metadata from the matches for context
        print("Extracting metadata...")
        metadata = [
            match['metadata'] for match in matches
        ]

        # Check if metadata is empty
        if not metadata:
            return jsonify({"error": "No metadata found in matches"}), 500

        # Step 4: Get the response from the LLM using the context
        print("Generating LLM response...")
        context = " ".join([m['content'] for m in metadata])  # You can adjust the content you want to include
        llm_response = llm_query_response(query, context)

        # Check if llm_response is None
        if llm_response is None:
            return jsonify({"error": "LLM response is None"}), 500

        # Return only the necessary data (metadata and LLM response)
        return jsonify(
            {
                "query": query,
                "response": llm_response,
                "matches_metadata": metadata  # Returning only the metadata
            }
        )
    
    except Exception as e:
        import traceback
        print("Detailed Error Trace:", traceback.format_exc())  # Print full traceback
        return jsonify({"error": str(e)}), 500
