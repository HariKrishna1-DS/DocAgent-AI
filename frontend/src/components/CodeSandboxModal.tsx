import React, { useState } from 'react';
import {
  Terminal,
  Play,
  X,
  Copy,
  Check,
  BookOpen,
  RotateCcw,
  Sparkles,
  MessageSquareCode,
  Sliders
} from 'lucide-react';
import { runCodeSnippet } from '../services/api';

export interface PracticeProgram {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  code: string;
  defaultInputs: string;
}

export const PRACTICE_PROGRAMS: PracticeProgram[] = [
  {
    id: 'greeting_input',
    title: '1. User Greeting & Age Calculation',
    category: 'Input & Strings',
    description: 'Learn basic input(), string formatting with f-strings, and type conversion with int().',
    tags: ['input()', 'int()', 'f-strings'],
    defaultInputs: 'Harikrishna\n25',
    code: `# 1. Greeting & User Input Example
# input() pauses program execution and waits for user input
name = input("Enter your name: ")
age_str = input("Enter your age: ")

# Convert string input to integer
age = int(age_str)
current_year = 2026
birth_year = current_year - age

print("=" * 35)
print(f"👋 Welcome to Python, {name}!")
print(f"📅 You are approximately {age} years old.")
print(f"🎂 That means you were born around {birth_year}!")
print("=" * 35)
`,
  },
  {
    id: 'calculator_input',
    title: '2. Interactive Math Calculator',
    category: 'Arithmetic & Conditions',
    description: 'Takes numbers and an operator (+, -, *, /, **) from input and calculates the result.',
    tags: ['float(input())', 'if / elif / else', 'operators'],
    defaultInputs: '45.5\n*\n4',
    code: `# 2. Interactive Calculator with input()
print("=== Simple Python Calculator ===")
num1 = float(input("Enter first number: "))
operator = input("Enter operation (+, -, *, /, **): ").strip()
num2 = float(input("Enter second number: "))

if operator == "+":
    result = num1 + num2
elif operator == "-":
    result = num1 - num2
elif operator == "*":
    result = num1 * num2
elif operator == "/":
    if num2 != 0:
        result = num1 / num2
    else:
        result = "Error: Division by zero is undefined"
elif operator == "**":
    result = num1 ** num2
else:
    result = f"Error: Unknown operator '{operator}'"

print("-" * 35)
print(f"Result: {num1} {operator} {num2} = {result}")
print("-" * 35)
`,
  },
  {
    id: 'even_odd_input',
    title: '3. Even / Odd & Sign Checker',
    category: 'Conditionals',
    description: 'Uses the modulo operator (%) to test if an input number is even or odd, positive or negative.',
    tags: ['modulo %', 'nested if', 'parity'],
    defaultInputs: '47',
    code: `# 3. Even / Odd and Positive / Negative Checker
number = int(input("Enter an integer number: "))

print(f"\nAnalyzing number: {number}")
print("-" * 30)

# Check parity (Even or Odd)
if number % 2 == 0:
    print(f"• {number} is an EVEN number (divisible by 2).")
else:
    print(f"• {number} is an ODD number.")

# Check sign (Positive, Negative, or Zero)
if number > 0:
    print(f"• {number} is a POSITIVE number.")
elif number < 0:
    print(f"• {number} is a NEGATIVE number.")
else:
    print("• The number is ZERO.")
`,
  },
  {
    id: 'palindrome_input',
    title: '4. Palindrome & String Slicing',
    category: 'Strings & Slicing',
    description: 'Cleans spaces, lowers case, and uses Python string slicing [::-1] to check for palindromes.',
    tags: ['[::-1] slicing', 'replace()', 'lower()'],
    defaultInputs: 'A man a plan a canal Panama',
    code: `# 4. Palindrome Word & Phrase Checker
text = input("Enter a word or phrase: ")

# Remove whitespace and convert to lowercase
cleaned = text.replace(" ", "").lower()
reversed_text = cleaned[::-1]

print("\n--- Palindrome Analysis ---")
print(f"Original Text: '{text}'")
print(f"Cleaned Text : '{cleaned}'")
print(f"Reversed Text: '{reversed_text}'")

if cleaned == reversed_text:
    print("\n🎉 Verdict: YES! It IS a Palindrome!")
else:
    print("\n❌ Verdict: NO, it is NOT a palindrome.")
`,
  },
  {
    id: 'multiplication_table',
    title: '5. Multiplication Table Generator',
    category: 'Loops',
    description: 'Generates an aligned multiplication table for any input base number up to a specified count.',
    tags: ['for loop', 'range()', 'formatting'],
    defaultInputs: '8\n12',
    code: `# 5. Multiplication Table Generator
base = int(input("Enter the table number (e.g. 7 or 8): "))
limit = int(input("Enter the count limit (e.g. 10 or 12): "))

print(f"\n{'='*12} Multiplication Table for {base} {'='*12}")
for i in range(1, limit + 1):
    product = base * i
    print(f"{base:3d}  x  {i:2d}  =  {product:4d}")
print("=" * 45)
`,
  },
  {
    id: 'temperature_converter',
    title: '6. Temperature Scale Converter',
    category: 'Formulas & Math',
    description: 'Takes a temperature in Celsius and converts it to Fahrenheit, Kelvin, and gives a weather tip.',
    tags: ['float math', 'precision formatting', 'branches'],
    defaultInputs: '32.5',
    code: `# 6. Temperature Converter (Celsius to Fahrenheit & Kelvin)
celsius = float(input("Enter temperature in Celsius (°C): "))

fahrenheit = (celsius * 9 / 5) + 32
kelvin = celsius + 273.15

print(f"\n{'*'*15} Temperature Report {'*'*15}")
print(f"Celsius   : {celsius:6.2f} °C")
print(f"Fahrenheit: {fahrenheit:6.2f} °F")
print(f"Kelvin    : {kelvin:6.2f} K")

if celsius >= 35:
    advice = "🔥 Extremely Hot: Stay hydrated and stay indoors!"
elif celsius >= 25:
    advice = "☀️ Warm & Sunny: Perfect outdoor weather."
elif celsius >= 15:
    advice = "🌤️ Mild & Pleasant: Great day for a walk."
else:
    advice = "❄️ Chilly / Cold: Wear a warm jacket!"

print(f"\nRecommendation: {advice}")
print("*" * 50)
`,
  },
  {
    id: 'grade_calculator',
    title: '7. Student Grades & Average Report',
    category: 'Lists & Stats',
    description: 'Takes student name and comma-separated scores, parses them into a list, and computes stats.',
    tags: ['list comprehension', 'sum()', 'max()', 'min()'],
    defaultInputs: 'Alex Morgan\n88, 95, 78, 92, 85',
    code: `# 7. Student Grade Calculator
student_name = input("Enter student name: ")
raw_scores = input("Enter subject marks (comma-separated, e.g. 85, 90, 78): ")

# Split string and convert each score to float
scores = [float(s.strip()) for s in raw_scores.split(",") if s.strip()]

if scores:
    total = sum(scores)
    avg = total / len(scores)
    highest = max(scores)
    lowest = min(scores)

    if avg >= 90:
        grade = "A (Distinction)"
    elif avg >= 80:
        grade = "B (First Class)"
    elif avg >= 70:
        grade = "C (Second Class)"
    elif avg >= 60:
        grade = "D (Pass)"
    else:
        grade = "F (Needs Improvement)"

    print(f"\n{'='*10} Academic Report: {student_name} {'='*10}")
    print(f"Subjects Recorded : {len(scores)}")
    print(f"Total Marks       : {total:.1f} / {len(scores) * 100}")
    print(f"Average Score     : {avg:.2f}%")
    print(f"Highest Score     : {highest:.1f}")
    print(f"Lowest Score      : {lowest:.1f}")
    print(f"Final Grade       : {grade}")
    print("=" * 45)
else:
    print("Error: No valid scores entered.")
`,
  },
  {
    id: 'guess_number',
    title: '8. Secret Number Guessing Game',
    category: 'Game Logic & Loops',
    description: 'Simulates multiple user guesses to find a secret number with helpful high/low hints.',
    tags: ['while / for loops', 'game logic', 'comparison'],
    defaultInputs: '25 60 40 42',
    code: `# 8. Secret Number Guessing Game
SECRET_NUMBER = 42
print("=== Guess The Secret Number (1 to 100) ===")

guesses_input = input("Enter your guesses separated by spaces (e.g. 20 55 42): ")
guess_list = [int(g) for g in guesses_input.split() if g.isdigit()]

won = False
for attempt, guess in enumerate(guess_list, start=1):
    print(f"\nAttempt #{attempt}: You guessed {guess}")
    if guess == SECRET_NUMBER:
        print(f"🎉 BINGO! You found the secret number ({SECRET_NUMBER}) in {attempt} attempts!")
        won = True
        break
    elif guess < SECRET_NUMBER:
        print("🔼 Too LOW! Guess higher next time.")
    else:
        print("🔽 Too HIGH! Guess lower next time.")

if not won:
    print(f"\nGame Over! The secret number was {SECRET_NUMBER}. Try again!")
`,
  },
  {
    id: 'shopping_cart',
    title: '9. Shopping Cart Receipt with Tax',
    category: 'Data Parsing & Formatting',
    description: 'Parses item:price pairs, calculates subtotal, tax, and prints an aligned receipt.',
    tags: ['string parsing', 'accumulation', 'receipt'],
    defaultInputs: 'Jordan\nCoffee:3.50, Sandwich:8.25, Cookie:2.50, Juice:4.00',
    code: `# 9. Shopping Cart Receipt with Tax
customer = input("Enter customer name: ")
cart_input = input("Enter items (Format: Name:Price, Name:Price): ")

print(f"\n{'='*15} DOCU-STORE RECEIPT {'='*15}")
print(f"Customer: {customer}")
print("-" * 45)
print(f"{'Item':<25} {'Price ($)':>15}")
print("-" * 45)

subtotal = 0.0
items = cart_input.split(",")
for item in items:
    if ":" in item:
        name, price_str = item.split(":", 1)
        try:
            price = float(price_str.strip())
            subtotal += price
            print(f"{name.strip():<25} {price:>15.2f}")
        except ValueError:
            pass

tax_rate = 0.0825  # 8.25% sales tax
tax_amount = subtotal * tax_rate
grand_total = subtotal + tax_amount

print("-" * 45)
print(f"{'Subtotal:':<25} {subtotal:>15.2f}")
print(f"{'Sales Tax (8.25%):':<25} {tax_amount:>15.2f}")
print(f"{'GRAND TOTAL:':<25} " + "$" + f"{grand_total:>14.2f}")
print("=" * 45)
print("Thank you for shopping with us! Have a great day!")
`,
  },
  {
    id: 'custom_scratchpad',
    title: '✍️ Blank Python Scratchpad',
    category: 'Freeform',
    description: 'Empty canvas to write, test, and practice any custom Python code with input().',
    tags: ['Custom Code', 'input()', 'Scratchpad'],
    defaultInputs: 'World',
    code: `# Write your own Python code here!
# You can test input() functions, loops, functions, and libraries like math, json, re, random.

user_input = input("Say something to Python: ")
print(f"You typed: '{user_input}'")

for i in range(1, 4):
    print(f"Step {i}: Python is running smoothly!")
`,
  },
];

interface CodeSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
}

export const CodeSandboxModal: React.FC<CodeSandboxModalProps> = ({
  isOpen,
  onClose,
  initialCode,
}) => {
  const [selectedProgramId, setSelectedProgramId] = useState<string>(PRACTICE_PROGRAMS[0].id);
  const [code, setCode] = useState<string>(
    initialCode || PRACTICE_PROGRAMS[0].code
  );
  const [inputs, setInputs] = useState<string>(PRACTICE_PROGRAMS[0].defaultInputs);
  const [output, setOutput] = useState<string | null>(null);
  const [running, setRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showInputs, setShowInputs] = useState<boolean>(true);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  if (!isOpen) return null;

  const currentProgram =
    PRACTICE_PROGRAMS.find((p) => p.id === selectedProgramId) || PRACTICE_PROGRAMS[0];

  const handleSelectProgram = (program: PracticeProgram) => {
    setSelectedProgramId(program.id);
    setCode(program.code);
    setInputs(program.defaultInputs);
    setOutput(null);
    setExecutionTime(null);
  };

  const handleRun = async () => {
    if (!code.trim()) return;
    setRunning(true);
    const startTime = performance.now();
    try {
      const res = await runCodeSnippet(code, inputs);
      setOutput(res.output);
      setExecutionTime(Math.round(performance.now() - startTime));
    } catch (err: any) {
      setOutput(`Error executing code: ${err.message}`);
      setExecutionTime(Math.round(performance.now() - startTime));
    } finally {
      setRunning(false);
    }
  };

  const handleResetToCurrentProgram = () => {
    setCode(currentProgram.code);
    setInputs(currentProgram.defaultInputs);
    setOutput(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md transition-opacity">
      <div className="relative w-full max-w-4xl flex flex-col max-h-[92vh] glass-modal rounded-3xl border border-theme-subtle shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-theme-subtle header-bg shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-sm">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-black text-theme-primary font-heading">
                  Python Practice Sandbox
                </h3>
                <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Python 3.13 • with input() support
                </span>
              </div>
              <p className="text-[11px] font-semibold text-theme-muted">
                Execute interactive Python scripts with input methods, algorithms, and output simulation
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="p-2 text-xs font-bold text-theme-muted hover:text-theme-primary card-bg hover:bg-black/5 dark:hover:bg-white/10 border border-theme-subtle rounded-xl transition-all flex items-center space-x-1 shadow-sm cursor-pointer"
              title="Copy Code to Clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-theme-muted hover:text-theme-primary rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              title="Close Sandbox"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Practice Programs Carousel / Selector Bar */}
        <div className="px-6 py-2.5 border-b border-theme-subtle bg-slate-50/50 dark:bg-slate-900/40 shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center space-x-1.5 text-xs font-black text-theme-primary">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>Select Practice Program:</span>
            </div>
            <span className="text-[11px] font-semibold text-theme-muted">
              {currentProgram.description}
            </span>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
            {PRACTICE_PROGRAMS.map((prog) => {
              const isSelected = prog.id === selectedProgramId;
              return (
                <button
                  key={prog.id}
                  onClick={() => handleSelectProgram(prog)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-[1.02]'
                      : 'card-bg text-theme-secondary hover:text-theme-primary border border-theme-subtle hover:bg-black/5 dark:hover:bg-white/10'
                  }`}
                >
                  <span>{prog.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 app-bg">
          
          {/* Active Program Info & Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl glass-panel border border-theme-subtle shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black text-theme-primary flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{currentProgram.title}</span>
              </span>
              <div className="flex items-center space-x-1">
                {currentProgram.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowInputs(!showInputs)}
                className={`px-3 py-1 text-xs font-bold rounded-xl border transition-all flex items-center space-x-1.5 cursor-pointer ${
                  showInputs
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                    : 'card-bg text-theme-muted hover:text-theme-primary border-theme-subtle'
                }`}
                title="Toggle Program Inputs Panel"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Inputs (stdin) {inputs.trim() ? '✓' : ''}</span>
              </button>

              <button
                onClick={handleResetToCurrentProgram}
                className="px-2.5 py-1 text-xs font-bold text-theme-muted hover:text-theme-primary card-bg border border-theme-subtle rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center space-x-1 cursor-pointer"
                title="Reset Code & Inputs to Template"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={handleRun}
                disabled={running}
                className="px-4 py-1.5 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-xl shadow-md shadow-emerald-600/30 flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                {running ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Program</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Program Inputs (stdin) Box - Always easily accessible for practicing input() */}
          {showInputs && (
            <div className="p-3.5 rounded-2xl input-bg border border-blue-500/30 shadow-sm space-y-1.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquareCode className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-black text-theme-primary font-heading">
                    Program Inputs (stdin for input() calls)
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-theme-muted">
                  💡 Each line or value will be supplied to consecutive <code className="font-mono text-blue-500">input()</code> prompts.
                </span>
              </div>
              <textarea
                value={inputs}
                onChange={(e) => setInputs(e.target.value)}
                rows={2}
                placeholder="Enter input values here (e.g. Alex on line 1, 25 on line 2)..."
                className="w-full p-2.5 text-xs font-mono text-blue-600 dark:text-blue-300 card-bg border border-theme-medium rounded-xl focus:outline-none focus:border-blue-500 font-bold leading-relaxed resize-y shadow-inner"
              />
            </div>
          )}

          {/* Code Editor */}
          <div>
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-xs font-black text-theme-secondary flex items-center space-x-1.5">
                <span>Python Script Editor</span>
                <span className="text-[10px] text-theme-muted font-normal">
                  (Feel free to modify or write your own code below)
                </span>
              </span>
              <span className="text-[10px] font-mono font-bold text-theme-muted">
                {code.split('\n').length} lines
              </span>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={11}
              spellCheck={false}
              className="w-full p-4 text-xs font-mono text-emerald-800 dark:text-emerald-300 input-bg border-2 border-theme-medium rounded-2xl focus:outline-none focus:border-emerald-500 font-semibold leading-relaxed resize-y shadow-md"
            />
          </div>

          {/* Execution Output Terminal */}
          {output !== null && (
            <div className="space-y-1.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black text-theme-primary flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-emerald-500" />
                  <span>Execution Output (Terminal)</span>
                  {executionTime !== null && (
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-theme-muted">
                      ⏱ {executionTime}ms
                    </span>
                  )}
                </span>

                <button
                  onClick={() => setOutput(null)}
                  className="text-[11px] font-bold text-theme-muted hover:text-theme-primary transition-colors cursor-pointer"
                >
                  Clear Output
                </button>
              </div>

              <div className="rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
                {/* Terminal top bar */}
                <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                    <span className="ml-2 text-slate-300 font-bold">stdout / interactive terminal</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Python 3.13</span>
                </div>

                <pre className="p-4 text-xs font-mono text-emerald-400 bg-slate-950 max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner selection:bg-emerald-800 selection:text-white">
                  {output || '<Program completed with no printed output>'}
                </pre>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-theme-subtle header-bg flex items-center justify-between text-[11px] font-bold text-theme-muted shrink-0">
          <span>Tip: Select any practice program from the top bar to learn how it works, then edit and click "Run Program"!</span>
          <span className="font-mono text-[10px]">DocuAgent Python Sandbox</span>
        </div>

      </div>
    </div>
  );
};
