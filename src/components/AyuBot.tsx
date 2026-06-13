import { useState, useRef, useEffect } from 'react';
import { Sparkles, MessageCircle, Send, X, ClipboardCheck, AlertCircle } from 'lucide-react';
import Logo from './Logo';

interface AyuBotProps {
  onSuggestProduct: (productId: string) => void;
  onNavigateToShop: () => void;
}

export default function AyuBot({ onSuggestProduct, onNavigateToShop }: AyuBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content: 'Pranam! I am Dr. Ayu, your AI Ayurvedic Wellness Companion. 🧘🌿 Let me assess your Dosha or help you choose the perfect slow-cooked organic formulations. What bodily symptoms or goals shall we address today?'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Dosha Questionnaire States
  const [quizMode, setQuizMode] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  
  const quizQuestions = [
    {
      question: "Which option best describes your body shape and skeletal framing?",
      options: [
        { text: "Lean, thin, tall, difficult to gain weight (Vata)", dosha: "Vata" },
        { text: "Medium frame, muscular, athletic, gains/loses weight easily (Pitta)", dosha: "Pitta" },
        { text: "Broad frame, thick, solid, gains weight easily, slow metabolism (Kapha)", dosha: "Kapha" }
      ]
    },
    {
      question: "How does your facial skin react to weather changes or food?",
      options: [
        { text: "Dry, flaky, rough or thin, sensitive to dry wind (Vata)", dosha: "Vata" },
        { text: "Warm, reddish, prone to acne, freckles, or heat rashes (Pitta)", dosha: "Pitta" },
        { text: "Thick, soft, smooth, oily, slow aging, prone to water retention (Kapha)", dosha: "Kapha" }
      ]
    },
    {
      question: "Which description matches your digestive system (Agni)?",
      options: [
        { text: "Erratic, unpredictable bloating, gas, changeable appetite (Vata)", dosha: "Vata" },
        { text: "Strong, intense heat, can eat multiple times, easily irritable stomach (Pitta)", dosha: "Pitta" },
        { text: "Slow, heavy feelings after small meals, sluggish bowel (Kapha)", dosha: "Kapha" }
      ]
    },
    {
      question: "How do you naturally handle modern stress or work pressure?",
      options: [
        { text: "Worry, sleeplessness, over-thinking, pacing thoughts (Vata)", dosha: "Vata" },
        { text: "Anger, fiery temper, impatience, highly critical of mistakes (Pitta)", dosha: "Pitta" },
        { text: "Calm, slow, avoids arguments, sleeps long, sometimes depressed (Kapha)", dosha: "Kapha" }
      ]
    }
  ];

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, quizMode, quizStep]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message to history
    const userMsg = { role: 'user' as const, content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] })
      });
      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.text || 'Dr. Ayu could not retrieve deep herbal context. Pranam.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Pranam. I had a slight connection anomaly on my spiritual link. Please try again soon.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startQuiz = () => {
    setQuizMode(true);
    setQuizStep(0);
    setQuizAnswers([]);
    setMessages(prev => [...prev, { role: 'user', content: 'Let us start the Ayurvedic Dosha Quiz! Let’s find my type.' }]);
  };

  const selectQuizOption = (dosha: string, optionText: string) => {
    const updatedAnswers = [...quizAnswers, dosha];
    setQuizAnswers(updatedAnswers);

    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // Analyze results
      setQuizMode(false);
      
      const counts: Record<string, number> = { Vata: 0, Pitta: 0, Kapha: 0 };
      updatedAnswers.forEach(ans => {
        counts[ans] = (counts[ans] || 0) + 1;
      });

      let dominantDosha = 'Vata';
      let maxCount = 0;
      Object.entries(counts).forEach(([dosha, count]) => {
        if (count > maxCount) {
          maxCount = count;
          dominantDosha = dosha;
        }
      });

      let recommendationPrompt = '';
      if (dominantDosha === 'Vata') {
        recommendationPrompt = 'I have analyzed that my dominant dosha is VATA. Tell me about my Vata energy characteristics, diet tips, and suggest the best GoAyu products (such as Ashwagandha drops or Amrit Kesh Hair oil) to ground my Vata.';
      } else if (dominantDosha === 'Pitta') {
        recommendationPrompt = 'My dominant dosha is PITTA. Tell me about my Pitta physical characteristics, cooling diet rules, and suggest GoAyu products like Tejas face cleanser or Kumkumadi serum to soothe skin inflammation.';
      } else {
        recommendationPrompt = 'My dominant dosha is KAPHA. Tell me about my Kapha solid energy details, stimulating exercises, and recommend organic Chyawanprash or Triphala caps to cleanse my digestives.';
      }

      handleSend(recommendationPrompt);
    }
  };

  return (
    <>
      {/* Absolute floating widget button */}
      <button
        id="ayubot-drawer-toggle"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-emerald-800 to-amber-700 hover:from-emerald-950 hover:to-amber-800 text-white rounded-full p-3.5 px-4.5 shadow-2xl flex items-center gap-2 cursor-pointer transition-all duration-300 hover:scale-105"
        title="Consult AI Ayurvedic Vaidya"
      >
        <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
        <span className="text-sm font-semibold tracking-wide">Dr. Ayu (AI Bot)</span>
      </button>

      {/* Drawer Container Panel */}
      {isOpen && (
        <div id="ayubot-drawer-root" className="fixed bottom-0 right-0 sm:right-6 sm:bottom-6 w-full sm:w-110 h-[92vh] sm:h-[82vh] bg-stone-50 border border-light-beige/60 sm:rounded-2xl shadow-2xl z-50 flex flex-col animate-in slide-in-from-bottom sm:slide-in-from-right duration-300 overflow-hidden">
          
          {/* Header */}
          <div className="bg-emerald-900 p-4.5 text-white flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center font-bold text-emerald-900 border border-emerald-950 overflow-hidden shrink-0">
                <Logo showText={false} className="h-10 w-10" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm tracking-wide text-white">Dr. Ayu (GoAyu Wellness Vaidya)</h4>
                <p className="text-[10px] text-emerald-300 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping" />
                  Ayuryedic Clinical Assistant (Online)
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-emerald-800 rounded-full transition-colors cursor-pointer text-emerald-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Info Bar */}
          <div className="bg-emerald-950 px-4 py-2 text-[11px] text-emerald-200 flex justify-between items-center">
            <span className="font-sans">Dosha balance and Ayurvedic herbal matching.</span>
            {!quizMode && messages.length <= 1 && (
              <button
                onClick={startQuiz}
                className="flex items-center gap-1 text-xs text-amber-400 hover:text-white font-bold tracking-wider cursor-pointer"
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
                TAKE DOSHA QUIZ
              </button>
            )}
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-amber-100 text-amber-950 border border-amber-200 rounded-tr-none'
                      : 'bg-white text-stone-800 border border-light-beige font-sans rounded-tl-none'
                  }`}
                >
                  {/* Basic text parser with simple markdown tags representation */}
                  <div className="whitespace-pre-wrap">
                    {m.content}
                  </div>
                  
                  {/* Shortcut helper if a specific product keyword is outputted */}
                  {m.role === 'assistant' && (
                    <div className="mt-2 text-xs flex flex-wrap gap-1.5">
                      {m.content.toLowerCase().includes('elixir') && (
                        <button onClick={() => onSuggestProduct('prod1')} className="text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/50 px-2 py-1 rounded-md text-[10px] font-semibold tracking-wide cursor-pointer">
                          View Saffron Elixir ✦
                        </button>
                      )}
                      {m.content.toLowerCase().includes('hair') && (
                        <button onClick={() => onSuggestProduct('prod2')} className="text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/50 px-2 py-1 rounded-md text-[10px] font-semibold tracking-wide cursor-pointer">
                          View Hair Booster Oil ✦
                        </button>
                      )}
                      {m.content.toLowerCase().includes('chyawan') && (
                        <button onClick={() => onSuggestProduct('prod3')} className="text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/50 px-2 py-1 rounded-md text-[10px] font-semibold tracking-wide cursor-pointer">
                          View Chyawanprash Max ✦
                        </button>
                      )}
                      {m.content.toLowerCase().includes('clean') && (
                        <button onClick={() => onSuggestProduct('prod4')} className="text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/50 px-2 py-1 rounded-md text-[10px] font-semibold tracking-wide cursor-pointer">
                          View Purifying Cleanse wash ✦
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* AI Loading Bubble */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-stone-400 border border-light-beige rounded-2xl rounded-tl-none px-4 py-3 text-sm flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-[11px] font-mono pl-1.5">Dr. Ayu is consulting texts...</span>
                </div>
              </div>
            )}

            {/* Questionnaire Quiz Panel */}
            {quizMode && (
              <div className="mt-4 bg-gradient-to-br from-amber-50/50 to-emerald-50/20 border border-amber-500/20 rounded-xl p-4 shadow-sm animate-in fade-in duration-300">
                <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold tracking-wider uppercase mb-2">
                  <ClipboardCheck className="w-4 h-4 text-emerald-700" />
                  <span>Interactive Dosha Profiler — Step {quizStep + 1} of 4</span>
                </div>
                <p className="text-sm font-semibold text-emerald-950 mb-3">{quizQuestions[quizStep].question}</p>
                <div className="space-y-2">
                  {quizQuestions[quizStep].options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => selectQuizOption(opt.dosha, opt.text)}
                      className="w-full text-left bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-700/40 p-3 rounded-lg text-xs leading-relaxed transition-colors cursor-pointer shadow-sm text-stone-700 hover:text-emerald-950 font-medium"
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick-Link Recommendation Chips */}
          {!quizMode && !isLoading && (
            <div className="px-3 py-2 bg-stone-100/50 border-t border-stone-100 overflow-x-auto flex space-x-2 whitespace-nowrap scrollbar-none">
              <button
                onClick={startQuiz}
                className="bg-emerald-850 hover:bg-emerald-900 hover:text-white text-emerald-100 text-xs px-3 py-1.5 rounded-full font-semibold border border-emerald-950 flex items-center gap-1 cursor-pointer"
              >
                ☯ Check My Dosha
              </button>
              <button
                onClick={() => handleSend("Describe Ayurvedic secrets to control bad acne breakouts and dry patches.")}
                className="bg-white hover:bg-emerald-50 text-emerald-950 border border-stone-200 text-xs px-3 py-1.5 rounded-full cursor-pointer"
              >
                🍃 Acne & Glow Remedies
              </button>
              <button
                onClick={() => handleSend("Explain which herbs cure hair thinning and gray hair according to Rasa therapy.")}
                className="bg-white hover:bg-emerald-50 text-emerald-950 border border-stone-200 text-xs px-3 py-1.5 rounded-full cursor-pointer"
              >
                💇 Hair-loss Solutions
              </button>
              <button
                onClick={() => handleSend("I struggle with morning lethargy and gas bloating. What adaptogens clear my digestion?")}
                className="bg-white hover:bg-emerald-50 text-emerald-950 border border-stone-200 text-xs px-3 py-1.5 rounded-full cursor-pointer"
              >
                🔥 Fire Up Metabolism (Agni)
              </button>
            </div>
          )}

          {/* Footer Input Area */}
          <div className="p-3.5 bg-white border-t border-stone-150 flex items-center gap-2">
            <input
              id="ayubot-user-input"
              type="text"
              placeholder="Ask Dr. Ayu anything about organic life, herbs..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend(inputText);
              }}
              disabled={isLoading || quizMode}
              className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-800 focus:bg-white disabled:opacity-50 text-stone-800"
            />
            <button
              id="ayubot-send-btn"
              onClick={() => handleSend(inputText)}
              disabled={isLoading || quizMode || !inputText.trim()}
              className="bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white rounded-xl p-2.5 px-3.5 cursor-pointer transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
