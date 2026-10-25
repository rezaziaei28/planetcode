# Planet Code

An online learning platform built with Django. This is a personal project to practice full-stack web development and solving real-world UI/UX problems.

## About This Project

I built the frontend and static pages of this platform from scratch, focusing on a fully responsive design with a dark/light theme. I used AI as a pair-programmer to speed up the process, but my main job was to debug, fix, and adapt the AI-generated code to make it work perfectly. 

*Note: This project is currently in progress. The frontend is complete, and I am now designing the relational database and backend logic for courses, lessons, and instructors.*

## Challenges I Faced and Solved

Building this project wasn't just about writing code. I ran into several real-world bugs and layout issues that took time to solve. Here are the main ones:

### 1. Fixing the mobile hamburger menu and search icon
When I was building the mobile navigation, the hamburger menu didn't open when clicked, and sometimes it covered the entire screen with a dark overlay. Also, the search icon was overflowing outside its container and breaking the layout. I had to dig into the CSS and JavaScript to fix the `z-index` issues, adjust the absolute positioning, and write the correct event listeners to toggle the menu without messing up the rest of the page.

### 2. Replacing a custom JS carousel with Bootstrap
For the "Most Popular Courses" section, I initially wanted to write a custom JavaScript and CSS carousel so the cards would slide automatically. However, the AI-generated logic and animations kept breaking. I made the decision to pivot and use the **Bootstrap 5 Carousel** instead. I wrote two separate versions (one for desktop and one for mobile) to handle the different layouts and responsive behaviors perfectly.

### 3. Event Delegation for dynamic buttons
When I loaded courses or sections dynamically from the backend, the "add to cart", "edit", and "delete" buttons stopped working because they were added to the DOM after the page loaded. I solved this by using **event delegation** in JavaScript, attaching the event listener to a parent element that always exists, so it catches clicks on the new buttons.

### 4. Double-reset form bug and file previews
I had a bug where clicking the reset button on a form would reset the fields twice, which was frustrating. I had to debug my JavaScript event listeners to ensure the reset function only fired once. I also had to write custom JS to handle video and thumbnail previews using the `FileReader` API before the user saves the form, making sure the preview didn't conflict with other forms on the page.

### 5. Active class detection in the sidebar and navbar
At first, my sidebar and navigation links were always just one color and didn't highlight correctly. I learned to use `request.resolver_match.url_name` in Django templates to dynamically check which page the user is on and apply the `active` class only to the correct link.

## What I Learned

- **Working with AI:** I learned that AI is a great tool for speeding up development, but it doesn't replace a developer's brain. I had to carefully review, debug, and fix a lot of AI-generated code to make it production-ready.
- **Django Architecture:** How to structure a large project using multiple apps (accounts, pages, courses, cart, dashboard) and keep the code organized.
- **Template Inheritance:** Extending `base.html` to avoid duplicate code, and using `{% block extra_css %}` and `{% block extra_js %}` for page-specific assets.
- **JavaScript & DOM:** Working with `addEventListener`, event delegation for dynamic elements, `FileReader` for media previews, and fixing UI bugs in forms.
- **UI/UX:** Building a responsive layout with Bootstrap 5, handling dark/light themes with `localStorage`, and improving user experience with toast notifications.

## Technologies Used

- Python
- Django
- Bootstrap 5
- Vanilla JavaScript (DOM, Event Delegation, LocalStorage, FileReader)
- SQLite