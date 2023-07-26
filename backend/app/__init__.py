from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from app.database import db
from app.auth import auth_bp

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///db.sqlite"
app.config['SQLALCHEMY_TRACK_MODIFICATION'] = False
app.config['SECRET_KEY'] = 'SECRET_KEY_CHANGE_FOR_PRODUCTION'

db = SQLAlchemy(app)

app.register_blueprint(auth_bp, url_prefix='/auth')

@app.route('/migrate')
def migrate():
    with app.app_context():
        db.create_all()
    return 'Migration complete', 200

if __name__ == '__main__':
    app.run(debug=True)