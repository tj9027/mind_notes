Trumpet Technical Challenge

Context:
At trumpet we help companies sell by using digital sales rooms called pods. Think of pods as micro sites personalised for a company looking to purchase a product. It’s an all in one place for documents, images, video, text, etc. Sellers are able to customise their pods with different widgets which offer various functionality such as embedding Youtube videos, or displaying text.

If you would like to better understand what text widgets are, take a look at our help page on text widgets. https://intercom.help/trumpet/en/articles/6389888-how-do-i-add-text-to-a-pod

Challenge:

Build a web application with minimal styling. Where a user can add one, or more basic text widgets by clicking a button. The widget allows users to input a string of text, no need to worry about allowing formatting or fancy fonts. But there should be a way to add multiple text widgets and each text widget should have a border around it. 

The text should not be shared between widgets. Each widget is its own independent entity that can be filled with its own content. When a user is done typing, the text from that widget should be sent to the backend to be stored.

If the page is refreshed, the same widgets should be populated with the same text as entered before the page refresh.

Requirements:
	•	The application should allow the user to add widgets
	•	It should be able to handle large strings of text (e.g., 1000 characters).
	•	There should be tests using a unit testing framework.
	•	The solution should include a README.md file with instructions on how to run the application and tests.
	•	There should be some version control used, we recommend Git.
	•	Once you are finished with the task please upload it to a public code repository and share the link with sebastian@sendtrumpet.com via email.
Evaluation:

Your solution will be evaluated based on the following criteria:
	•	Correctness: Does your application meet all of the requirements?
	•	Efficiency: How efficient is your application in terms of time and space complexity?
	•	Code quality: Is your code well-written, organised, and readable?
	•	Testing: Did you write unit tests for your code?
	•	Documentation: Did you include a clear and concise README.md file?

Bonus points (these are not mandatory):

	•	Have a way to delete widgets.
	•	Your solution is inside a docker container.
	•	Discuss the tradeoff you have made.
	•	Discuss what you would do if you had more time on the challenge?

Tips:
	•	You can use in memory storage to hold the text entered.
	•	Use a testing framework to write unit tests for your code.
	•	Make sure your README.md file is clear and easy to follow.

