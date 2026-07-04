# Cathay Hackathon 2024 — Smart Travel Planner

> This project builds upon earlier concept exploration (2023), evolving into a full-stack AI-powered system design.


## Overview

Built for Cathay Hackathon 2024, this project is an AI-assisted travel planning platform that helps users generate personalized multi-leg itineraries, manage transfers, and centralize travel bookings. It focuses on demonstrating product thinking, scalable system design, and AI integration under hackathon constraints.

>Due to hackathon time constraints, this project focuses on a functional prototype demonstrating core user flows and system design rather than a fully production-ready implementation.


## Problem Statement

Modern travelers face multiple challenges when planning international trips:

* Difficulty finding and comparing ticket information across routes
* No centralized place to store or manage travel plans
* Confusion around transit stops and transfer routes
* Complexity in managing Cathay Pacific transfer flights and multi-leg journeys
* Fragmentation of booking systems across flights, hotels, and transport services




## Solution

This platform provides a unified travel planning experience where users can:

* Generate a complete travel plan with auto route with a few clicks
* Explore destinations freely with automatically suggested transfer routes when Cathay flights are available
* View and manage flight, hotel, and transport information in one system
* Reduce manual planning effort through structured AI-assisted recommendations

The system is designed to support both first-time travelers and Cathay loyalty members with tailored experiences.


## Pitching Video
Watch our pitch:
https://youtu.be/Cy4qAqxQ5l8


## Hester's Contributions

This was a collaborative hackathon project. Hester's primary contributions included:

- Designed the overall system architecture (backend + frontend) with UML diagrams and Interaction Flow
- Created the end-to-end user interaction flow and frontend state logic
- Designed the complete UI/UX in Figma
- Implemented the frontend using HTML, CSS Modules, and JavaScript
- Integrated the frontend with backend APIs
- Planned the product demonstration, including the pitching script and demo flow to effectively communicate the user journey and technical solution
- Collaborated with backend and AI teammates to deliver a functional prototype under hackathon constraints

---

## System Architecture (UML)

<img src="images/UML.jpg" width="1200"/>

## System Interaction Flow (Frontend–Backend–User State)

<img src="images/user_flow.jpg" width="1200"/>


## UI/UX Design 

The entire product was designed in Figma before implementation, with a strong focus on simplifying complex travel planning into a guided and structured user flow.

The design approach prioritized:

* Reducing cognitive load in multi-leg trip planning
* Making transfer and transit information visually clear
* Ensuring a consistent and scalable design system
* Supporting both first-time users and experienced Cathay members

### Design 

The full UI was first designed in Figma, covering key user flows including itinerary generation, trip overview, and booking concept screens.

Figma Design:
<table>
  <tr>
    <td>
      <img src="images/figma_form_filling.png" width="400"/>
      <br/>
      <img src="images/figma_ticket_depart.png" width="400"/>
      <br/>
      <img src="images/figma_cus_planning_form.png" width="400"/>
    </td>
    <td><img src="images/figma_travel_planner.png" width="400"/></td>
  </tr>
</table>

Figma Link:
https://www.figma.com/design/Tdzm25g9quMFj3gOfWuDWU/cathay-hackathon-2024?node-id=0-1&t=kWpwySHzXFE4W0co-1

---

### Implementation (Frontend Screenshots)

The frontend was implemented using Node js and CSS Modules, closely following the Figma design to maintain visual consistency and user experience fidelity.

Screenshots:
<div style="display: flex; gap: 10px;">
  <img src="images/chat_bot.jpg" width="500"/>
  <img src="images/my_planner.jpg" width="500"/>
</div>
<div style="display: flex; gap: 10px;">
  <img src="images/package_deliver.jpg" width="500"/>
  <img src="images/travel_planner.jpg" width="500"/>
</div>



## Tech Stack

* Frontend: HTML/CSS/JS
* Backend: Node.js
* AI Integration: Llama-based model
* Database: SQL (not included in this frontend repo)
* Architecture: Separated frontend and backend for scalability
* System design consideration: extensible architecture with potential for caching layer integration (future improvement)




## What We Learned

* Translating real-world travel pain points into a structured product solution
* Designing a system that combines AI-generated output with user-driven planning
* Building a scalable frontend-backend architecture under hackathon constraints
* Designing a complete product UI from scratch in Figma and translating it into a functional frontend implementation
* Thinking in terms of end-to-end user experience rather than isolated features
* Working with constraints while maintaining a clean system design direction
* Collaborating in a team environment to align design, frontend, backend, and AI components under tight time constraints


## Future Improvements

* Integration with real airline and hotel booking APIs
* Advanced caching layer for faster itinerary generation
* Improved personalization using user travel history
* Expansion of AI model for more accurate routing and recommendation
* Mobile-first redesign for better usability


## Architecture Summary

The system is built with a modular structure:

Frontend (HTML/CSS/JS) -> Backend (Node.js API Layer) -> AI Service (Llama-based itinerary generation) -> SQL Database (trip + user data)

This separation allows independent scaling of UI, logic, and AI processing components.


## Project Goal

The goal of this project is to demonstrate the ability to:

* Translate user pain points into a product concept
* Design a scalable full-stack system
* Integrate AI into practical user workflows
* Build a working prototype under time constraints

> Again, due to hackathon time constraints, this project focuses on a functional prototype demonstrating core user flows and system design rather than a fully production-ready implementation.

---

## How to Run Locally

```
npm install
node server.js
```

