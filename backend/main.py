from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ast
import sys
import io
import traceback

app = FastAPI(title="GFG Campus Club API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeRequest(BaseModel):
    code: str

class ExplainRequest(BaseModel):
    code: str
    error_message: str

@app.post("/api/run")
async def run_code(req: CodeRequest):
    """Execute Python code and return output or error details."""
    code = req.code

    # Step 1: AST-based syntax check
    try:
        ast.parse(code)
    except SyntaxError as e:
        return {
            "success": False,
            "error": {
                "type": "SyntaxError",
                "message": str(e.msg),
                "line": e.lineno or 1,
            },
            "output": "",
        }

    # Step 2: Execute code
    old_stdout = sys.stdout
    sys.stdout = captured = io.StringIO()
    try:
        exec(code, {"__builtins__": __builtins__}, {})
        output = captured.getvalue()
        return {"success": True, "output": output, "error": None}
    except IndentationError as e:
        return {
            "success": False,
            "error": {"type": "IndentationError", "message": str(e), "line": e.lineno or 1},
            "output": "",
        }
    except TypeError as e:
        return {
            "success": False,
            "error": {"type": "TypeError", "message": str(e), "line": 0},
            "output": "",
        }
    except NameError as e:
        return {
            "success": False,
            "error": {"type": "NameError", "message": str(e), "line": 0},
            "output": "",
        }
    except Exception as e:
        return {
            "success": False,
            "error": {"type": type(e).__name__, "message": str(e), "line": 0},
            "output": "",
        }
    finally:
        sys.stdout = old_stdout

@app.post("/api/explain")
async def explain_error(req: ExplainRequest):
    """Provide beginner-friendly error explanation (no AI needed for common errors)."""
    error = req.error_message.lower()

    explanations = {
        "syntaxerror": "You have a syntax error. This usually means Python can't understand your code structure. Check for missing colons (:), unmatched brackets, or incorrect indentation.",
        "indentationerror": "Python uses indentation to define code blocks. Make sure you use consistent spaces (4 spaces is recommended). Don't mix tabs and spaces.",
        "typeerror": "You're trying to use a value in a way that doesn't match its type. For example, adding a string to a number. Check your variable types.",
        "nameerror": "You're using a variable or function that hasn't been defined yet. Check for typos or make sure you've declared the variable before using it.",
        "indexerror": "You're trying to access a list index that doesn't exist. Remember, Python lists are 0-indexed, so the last element is at index len(list)-1.",
        "keyerror": "You're trying to access a dictionary key that doesn't exist. Check your key spelling or use .get() method instead.",
        "valueerror": "The value you provided is the right type but wrong value. For example, trying to convert 'abc' to an integer.",
        "zerodivisionerror": "You're trying to divide by zero, which is mathematically undefined. Add a check before dividing.",
    }

    for key, explanation in explanations.items():
        if key in error:
            return {"explanation": explanation}

    return {"explanation": f"An error occurred: {req.error_message}. Try breaking your code into smaller parts and testing each piece separately."}

@app.get("/api/health")
async def health():
    return {"status": "ok", "message": "GFG Campus Club API is running!"}
