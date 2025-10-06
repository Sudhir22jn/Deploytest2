
import os
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_openai import ChatOpenAI
import openai
from dotenv import load_dotenv
load_dotenv()

OPENAI_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_KEY or not OPENAI_KEY.startswith("sk-"):
    raise ValueError("❌ Please set a valid OpenAI API key in environment variable OPENAI_API_KEY.")

openai.api_key = OPENAI_KEY

# ---------------------------
# 2. Load FAISS index
# ---------------------------
INDEX_PATH = r"C:\Users\Administrator\PycharmProjects\RAGtest\softdel_index"

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
db = FAISS.load_local(INDEX_PATH, embeddings, allow_dangerous_deserialization=True)
retriever = db.as_retriever(search_kwargs={"k": 3})  # fetch top 3 docs

# ---------------------------
# 3. Setup OpenAI LLM
# ---------------------------
llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.2)

# ---------------------------
# 4. Context-aware QA function
# ---------------------------
# ---------------------------
# 4. Context-aware QA function
# ---------------------------
def answer_query(query: str):
    docs = retriever.invoke(query)
    context = "\n".join([doc.page_content for doc in docs])

    if not context.strip():
        return "I could not find the answer in the documents."

    prompt = f"""
You are Softdel Virtual Assistant 🤖. Your goal is to answer questions about Softdel, including IoT solutions, smart buildings, smart factories, and digital transformation, in a friendly, professional, and engaging tone.

Rules:

1. Personal or casual questions (e.g., "Hi", "Hello", "Who are you?", "How are you?"):

Respond in a friendly, lively way with emojis or symbols:

"👋 Hi there! How can I help you today?"

"😊 I’m Softdel’s Virtual Assistant 🤖. I’m here to help you explore Softdel’s solutions."

"👍 I’m good! How are you?"

Do not provide suggested topics or scheduling prompts.

2. Technical or company-related questions:

Answer only using the knowledge base, in 1–2 sentences.

Use eye-catching symbols or emojis in your answers to make them visually engaging, e.g., 💡, ⚡, 🚀, 🌐, 🏭.

Suggest 3 related topics at the end using bullets and emojis:
💡 You might also be interested in: 
• 🌐 Topic 1
• 🏭 Topic 2
• ⚡ Topic 3

Track the number of technical/company questions. After the 5th question, add a friendly scheduling prompt:
"📞 Since you’ve shown interest in our products and services, would you like me to schedule a call with one of our executives to discuss this further?"

3. Unknown topics or answers not in the knowledge base:

Respond with:
❌ "I could not find the answer for that topic. 📞 Would you like me to schedule a call with one of our executives to discuss this further?"

Do not provide related topic suggestions.

4. provide the answer using symbols/emojis/ animations to make it engaging.

5. Tone & Style:
 Friendly, professional, slightly conversational, and visually engaging with symbols or emoji “animations” (e.g., use arrows, sparkles, rockets, lightbulbs to emphasize points).

Encourage users to explore Softdel solutions and ask more questions.




Context:
{context}

Question: {query}
Answer:
"""
    response = llm.invoke(prompt)
    return response.content.strip()

# ---------------------------
# 5. Flask-friendly wrapper
# ---------------------------
def get_qan_answer(user_input: str):
    """
    Flask can call this function to get answer.
    """
    try:
        return answer_query(user_input)
    except Exception as e:
        print(f"Error in QA module: {e}")
        return "❌ I could not find the answer for that topic. 📞 Would you like me to schedule a call with one of our executives?"


# ---------------------------
# 6. CLI testing (optional)
# ---------------------------
if __name__ == "__main__":
    print("🤖 Softdel Chatbot CLI (type 'exit' to quit)\n")
    while True:
        query = input("🔍 Ask a question: ").strip()
        if query.lower() in ["exit", "quit", "q"]:
            print("👋 Exiting chatbot. Goodbye!")
            break
        answer = get_qan_answer(query)
        print("✅ Answer:", answer, "\n")
