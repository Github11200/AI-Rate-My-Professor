# Add embeddings to supabase
Pass one object at a time with the following schema:

interface ProfessorObject {
  name: string;
  subject: string;
  rating: number;
  description: string;
}

It will then automatically get added to Supabase

# Query vector database
Give 3 things, a prompt from the user, the user Id (you can get that from here, https://docs.kinde.com/developer-tools/sdks/backend/nextjs-sdk/), and the top K elements, so how many results you'd like back.

You can then pass this into the prompt for the chat model with Gemini.

# Chat
Simply pass the text, so a description, with the context being the result from the query, and then the actual prompt from the user.

# Scrape data
You just need to pass a URL. IMPORTANT, the link must be like this, https://www.ratemyprofessors.com/search/professors/5463?q=*, so it has to be a professor's page, you can get to here after you click on the school naem, and then click on the view all professors link, it will bring you to this page.

You will then get this schema back:

interface TeacherObject {
  name: string;
  rating: number;
  difficulty: number;
  reviews: string[];
}