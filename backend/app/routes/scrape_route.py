# scrape_route.py
import datetime
from bson.objectid import ObjectId
from flask import Blueprint, jsonify, request
from app.services.scraper import scrape_website
from app.db.models import ScrapedContent
from app.services.llm_integration import parse_scraped_data
from app.routes.auth_route import auth_required  # Import the auth_required decorator to ensure authentication

# Create a Blueprint
scrape_blueprint = Blueprint("scrape", __name__)

@scrape_blueprint.route("/scrape", methods=["POST"])
@auth_required  # Use the decorator to protect this route
def scrape():
    data = request.json
    url = data.get("url")

    if not url:
        return jsonify({"error": "URL is required"}), 400

    try:
        # Use the user_id from the decoded token, which is available as request.user_id
        user_id = request.user_id

        # Perform the scraping logic
        scraped_data = scrape_website(url)
        scraped_content = scraped_data.get("body_content")
        summary = parse_scraped_data(scraped_content)

        scraped_content_data = {
            "user_id": ObjectId(user_id),  # Save the user_id from the token
            "url": url,
            "content": scraped_content,
            "summary": summary,
            "created_at": datetime.datetime.now()
        }

        ScrapedContent.save_scraped_content(scraped_content_data)

        result = {
            "scraped_data": scraped_content,
            "summary": summary
        }
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
