import { useState } from "react";
import { faqData } from "../../data/faq";
import SectionTitle from "../common/SectionTitle";

export default function FAQ() {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionTitle
          title="Preguntas Frecuentes"
          subtitle="Resolviendo tus dudas sobre precios y procesos."
          centered={true}
        />

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map(item => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              
              {/* Question Button */}
              <button
                onClick={() => toggleExpand(item.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-left font-semibold text-gray-900">
                  {item.question}
                </h3>
                <span className={`text-2xl text-blue-900 transition-transform duration-300 ${
                  expandedId === item.id ? "rotate-45" : ""
                }`}>
                  +
                </span>
              </button>

              {/* Answer */}
              {expandedId === item.id && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}