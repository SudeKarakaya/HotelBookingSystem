 # Hotel Booking System

This project is a microservices-based hotel booking system developed as part of a backend & cloud computing course.
It demonstrates distributed system design, API Gateway, message queues, background jobs, and a machine learning–based price prediction service.

 ## Final Deployed URLs

Note: Services are designed for local development and cloud deployment experiments.
Some services were tested locally due to cloud deployment limitations.

Frontend:http://localhost:5173
API Gateway:http://localhost:8080
Hotel Search Service:http://localhost:3001
Booking Service:http://localhost:3002
Notification Service:http://localhost:3003
Hotel Admin Service:http://localhost:3004
ML Price Service:http://localhost:5000

 # System Architecture & Design

The system follows a microservices architecture:
- Each service is independent and owns its own logic
Services communicate via:
- REST APIs
- RabbitMQ
- An API Gateway routes all frontend requests
- A Machine Learning service predicts hotel room prices

 ## Architecture Components

Frontend: React + TypeScript
API Gateway: Express.js
Backend Services: Node.js + Express + MongoDB
Message Queue: RabbitMQ
ML Service: Python (Flask + Scikit-learn)

 ## Message Queue (RabbitMQ)

RabbitMQ is used for asynchronous communication between services.
 ### Example Flow;
Booking Service publishes a BOOKING_CREATED event
Notification Service consumes the event
A notification is created for the user
This design improves scalability and decoupling between services.

 ## Scheduler Design

A nightly scheduler is implemented via an internal endpoint:
Checks hotels with low remaining capacity
Sends admin notifications
Sends booking reminders for upcoming reservations
The scheduler is triggered manually or via cron simulation.
Cloud-based schedulers were tested but not fully deployed due to environment constraints.

## Machine Learning – Price Prediction

A simple regression-based ML model predicts hotel room prices.

Dataset
Source: Kaggle – Hotel Prices in Europe

Features used:
Season (month)
Room capacity
ML Workflow
Dataset preprocessing
Model training using Scikit-learn
Model saved as model.pkl
Flask API exposes /predict endpoint

The ML service is integrated with the Hotel Admin Service to suggest prices when creating rooms.

 # Data Models (ER)
 ## Main Entities
 ### Hotel
id
name
location
rooms[]

 ### Room
roomId
capacity
price
priceSource (ML or manual)
season

 ### Booking
id
userId
hotelId
roomId
from
to
status

 ### Notification
id
userId
type
message
createdAt
read

 # Assumptions

Authentication is simplified for demonstration purposes
Token-based access control is simulated on the frontend
Services are optimized for clarity and learning, not production scale
ML predictions are advisory, not final pricing rules

 # Issues Encountered

Full cloud deployment of all services was challenging due to:
- Port management
- Health check constraints(for AWS App Runner)
- Service to service networking

API Gateway forwarding required path rewriting
Frontend token handling required mock authentication for demo
Dataset required preprocessing due to non-numeric price formats in ML price server

 # Conclusion

This project demonstrates:
- Microservices architecture
- API Gateway pattern
- Message queues (RabbitMQ)
- Background job design
- ML integration into backend services
- Full-stack development
