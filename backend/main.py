# app.py
from flask import Flask
from flask_cors import CORS
from app.routes.scrape_route import scrape_blueprint  # Directly import the blueprint
from app.routes.query_route import query_blueprint
from app.routes.auth_route import auth_blueprint
app = Flask(__name__)
CORS(app)

# Register the Blueprint
app.register_blueprint(auth_blueprint, url_prefix="/auth")
app.register_blueprint(scrape_blueprint, url_prefix="/api")
app.register_blueprint(query_blueprint, url_prefix="/api")


@app.route("/")
def home():
    return "Welcome to the API!"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
