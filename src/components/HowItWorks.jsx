import { Ruler, Check, ArrowRight } from 'lucide-react';

export default function HowItWorks({ onStartDesigning }) {
  const steps = [
    {
      number: "01",
      title: "Curate & Discover",
      subtitle: "Archival designs with sample proportions",
      description:
        "Explore our catalog of architectural furniture. Each piece includes reference dimensions and material details to help visualize scale before arranging.",
      details: [
        "Standard metric proportion guides",
        "Tactile weave and stone material details",
        "Documented design provenance notes",
      ],
    },
    {
      number: "02",
      title: "Upload & Position",
      subtitle: "Direct 2D staging on your room photo",
      description:
        "Upload a photograph of your room or use our sample demo space. Move, resize, and rotate furniture pieces directly over your living area with touch-friendly controls.",
      details: [
        "Local browser upload (JPEG, PNG, WebP)",
        "Drag, scale, and rotate on 2D room canvas",
        "Local auto-save to browser storage (IndexedDB)",
      ],
    },
    {
      number: "03",
      title: "Proportions & Harmony",
      subtitle: "Test circulation and layout balance",
      description:
        "Verify that coffee table walkways maintain 45cm+ clearance and that seating proportions feel natural within your room sightlines before acquiring furniture.",
      details: [
        "Walking circulation clearance guides",
        "Ambient daylight tone simulation",
        "Undo and reset controls for flexible experimentation",
      ],
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-[#FFFDFA] border-y border-[#D8D2C8]" aria-labelledby="methodology-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-[#62694A] font-medium mb-3">
            <span>Methodology</span>
            <span className="text-[#D8D2C8]">/</span>
            <span>Room Planning</span>
          </div>
          <h2 id="methodology-heading" className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#292923] font-medium tracking-tight">
            How AURA Works
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#4A463D] font-normal leading-relaxed">
            Eliminating layout uncertainty through visual room planning. Test furniture proportions, circulation clearances, and arrangement balance directly on your personal room photograph.
          </p>
        </div>

        {/* 3 Editorial Numbered Steps */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {steps.map((step) => (
            <div
              key={step.number}
              className="p-6 sm:p-8 bg-[#F5F1E9] border border-[#D8D2C8] flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* Step Number with hairline rule */}
                <div className="flex items-center justify-between pb-4 border-b border-[#D8D2C8]">
                  <span className="font-mono text-2xl font-light text-[#62694A]">
                    {step.number}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-[#4A463D] font-mono">
                    Phase {step.number}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-2xl text-[#292923] font-normal">
                    {step.title}
                  </h3>
                  <p className="text-xs uppercase tracking-wider text-[#62694A] font-semibold mt-1">
                    {step.subtitle}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-[#4A463D] leading-relaxed font-normal">
                  {step.description}
                </p>
              </div>

              {/* Specification Bullets */}
              <div className="pt-4 border-t border-[#D8D2C8]/70 space-y-2.5">
                {step.details.map((detail, idx) => (
                  <div key={idx} className="flex items-center space-x-2.5 text-xs sm:text-sm text-[#292923]">
                    <Check className="w-4 h-4 text-[#62694A] shrink-0" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Spatial Clearance Diagnostic Callout */}
        <div className="mt-12 p-6 sm:p-8 bg-[#F5F1E9] border border-[#D8D2C8] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2 text-xs uppercase tracking-wider font-mono text-[#62694A]">
              <Ruler className="w-4 h-4" />
              <span>Architectural Clearance Standard</span>
            </div>
            <h4 className="font-serif text-xl sm:text-2xl text-[#292923] font-medium">
              Designed for harmonious interior proportions
            </h4>
            <p className="text-sm sm:text-base text-[#4A463D] font-normal leading-relaxed">
              Interior balance requires proper circulation. We recommend maintaining a minimum 45cm clearance around coffee tables and 90cm for primary walkways so movement through your room remains natural and unhindered.
            </p>
          </div>

          <button
            type="button"
            onClick={onStartDesigning}
            className="min-h-[44px] inline-flex items-center space-x-2 px-7 py-3.5 text-sm uppercase tracking-wider font-medium bg-[#62694A] hover:bg-[#4B5237] text-[#FFFDFA] transition-colors border border-[#62694A] cursor-pointer shadow-xs shrink-0 focus-visible:outline-2 focus-visible:outline-[#62694A]"
          >
            <span>Launch Room Planner</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
