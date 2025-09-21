import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Title() {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (svgRef.current) {
            const svg = svgRef.current;
            const waves = svg.querySelectorAll("#wave1, #wave2");

            gsap.set(waves, { x: 0 });

            gsap.to(waves, {
                x: -800,
                duration: 10,
                repeat: -1,
                ease: "none",
            });
        }
    }, []);

    return (
        <div className="font-[Modernist] tracking-normal font-bold h-1/4">
            <svg
                ref={svgRef}
                width="100%"
                height="100%"
                viewBox="0 0 800 80"
                preserveAspectRatio="xMidYMid slice"
            >
                <defs>
                    <linearGradient
                        id="waterGradient1"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                    >
                        <stop offset="0%" stopColor="#4a90e2" />
                        <stop offset="100%" stopColor="#357abd" />
                    </linearGradient>
                    <linearGradient
                        id="waterGradient2"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                    >
                        <stop offset="0%" stopColor="#63b3ed" />
                        <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                    <mask id="textMask">
                        <text
                            x="50%"
                            y="65"
                            fontSize="80"
                            fontWeight="bold"
                            textAnchor="middle"
                            fill="white"
                        >
                            EchoWave
                        </text>
                    </mask>
                </defs>

                <g mask="url(#textMask)">
                    <g id="waves">
                        <path
                            id="wave1"
                            fill="url(#waterGradient1)"
                            d="M0,20 Q200,40 400,20 T800,20 T1200,20 T1600,20 V80 H-800 V20 Q-600,40 -400,20 T0,20 Z"
                        />
                        <path
                            id="wave2"
                            fill="url(#waterGradient2)"
                            d="M0,25 Q200,45 400,25 T800,25 T1200,25 T1600,25 V80 H-800 V25 Q-600,45 -400,25 T0,25 Z"
                            opacity="0.7"
                        />
                    </g>
                </g>

                <text
                    x="50%"
                    y="65"
                    fontSize="80"
                    fontWeight="bold"
                    textAnchor="middle"
                    fill="none"
                >
                    EchoWave
                </text>
            </svg>
        </div>
    );
}
