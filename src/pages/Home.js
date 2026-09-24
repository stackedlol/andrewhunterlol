// src/pages/Home.js
import React, { useEffect, useRef } from 'react';
import { RltyLogo, HausLogo, NuraLogo, VolundLogo } from '../components/CompanyLogos';
import '../styles/Home.css';

const logoMask = `url("${process.env.PUBLIC_URL}/ANDREW%20LOGO.png")`;

// Perlin noise implementation
class PerlinNoise {
    constructor() {
        this.permutation = [];
        for (let i = 0; i < 256; i++) {
            this.permutation[i] = Math.floor(Math.random() * 256);
        }
        this.p = [...this.permutation, ...this.permutation];
    }

    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    lerp(t, a, b) {
        return a + t * (b - a);
    }

    grad(hash, x, y, z) {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }

    noise(x, y, z) {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        const Z = Math.floor(z) & 255;

        x -= Math.floor(x);
        y -= Math.floor(y);
        z -= Math.floor(z);

        const u = this.fade(x);
        const v = this.fade(y);
        const w = this.fade(z);

        const A = this.p[X] + Y;
        const AA = this.p[A] + Z;
        const AB = this.p[A + 1] + Z;
        const B = this.p[X + 1] + Y;
        const BA = this.p[B] + Z;
        const BB = this.p[B + 1] + Z;

        return this.lerp(w,
            this.lerp(v,
                this.lerp(u, this.grad(this.p[AA], x, y, z), this.grad(this.p[BA], x - 1, y, z)),
                this.lerp(u, this.grad(this.p[AB], x, y - 1, z), this.grad(this.p[BB], x - 1, y - 1, z))
            ),
            this.lerp(v,
                this.lerp(u, this.grad(this.p[AA + 1], x, y, z - 1), this.grad(this.p[BA + 1], x - 1, y, z - 1)),
                this.lerp(u, this.grad(this.p[AB + 1], x, y - 1, z - 1), this.grad(this.p[BB + 1], x - 1, y - 1, z - 1))
            )
        );
    }
}

function Home() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const perlin = new PerlinNoise();
        const rand = (v1, v2) => v1 + Math.random() * (v2 - v1);
        const deg = (a) => Math.PI / 180 * a;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Each canvas pixel covers PIXEL x PIXEL screen pixels, so the dither reads as grain
        const PIXEL = 2;
        // 4x4 ordered dither thresholds
        const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

        const opt = {
            lines: window.innerWidth > 500 ? 48 : 24,
            noiseScale: 0.006,
            angle: deg(-90),
            alpha: 44, // 0-255, kept faint so the text sits on top
            drift: 0.0015,
            fps: 30,
        };
        const color = ((opt.alpha << 24) | 0x00ffffff) >>> 0;

        let w = 0;
        let h = 0;
        let image = null;
        let buf = null;
        let seeds = [];
        let time = 0;
        let frame = null;
        let last = 0;

        // Jittered grid of seed points so lines spread evenly but not uniformly
        const initSeeds = () => {
            seeds = [];
            const cols = Math.ceil(Math.sqrt(opt.lines * (w / h)));
            const rows = Math.ceil(opt.lines / cols);
            for (let i = 0; i < opt.lines; i++) {
                const c = i % cols;
                const r = Math.floor(i / cols);
                seeds.push({
                    x: ((c + rand(0.1, 0.9)) / cols) * w,
                    y: ((r + rand(0.1, 0.9)) / rows) * h,
                    phase: rand(0, 100),
                });
            }
        };

        // Walk the flow field from a seed until the line leaves the screen
        const trace = (seed, dir) => {
            const maxSteps = (w + h) * 2;
            let x = seed.x;
            let y = seed.y;
            let density = 0;
            for (let s = 0; s < maxSteps; s++) {
                const n = perlin.noise(x * opt.noiseScale, y * opt.noiseScale, time);
                const a = n * Math.PI * 0.5 + opt.angle;
                x += Math.cos(a) * dir;
                y += Math.sin(a) * dir;

                const px = x | 0;
                const py = y | 0;
                if (px < 0 || py < 0 || px >= w || py >= h) return;

                // How solid the line is drifts along its length, from sparse specks to near-solid
                if ((s & 7) === 0) {
                    density = 0.3 + 0.8 * perlin.noise(s * dir * 0.012 + seed.phase, seed.phase, time * 2);
                }
                if (density > BAYER[((py & 3) << 2) | (px & 3)]) {
                    buf[py * w + px] = color;
                }
            }
        };

        const draw = () => {
            buf.fill(0);
            for (const seed of seeds) {
                trace(seed, 1);
                trace(seed, -1);
            }
            ctx.putImageData(image, 0, 0);
        };

        const resize = () => {
            w = Math.ceil(window.innerWidth / PIXEL);
            h = Math.ceil(window.innerHeight / PIXEL);
            canvas.width = w;
            canvas.height = h;
            image = ctx.createImageData(w, h);
            buf = new Uint32Array(image.data.buffer);
            initSeeds();
            draw();
        };

        // Click to swing the flow direction and scatter the lines
        const handleClick = () => {
            opt.angle += deg(rand(30, 90)) * (Math.random() > 0.5 ? 1 : -1);
            initSeeds();
            draw();
        };

        const animate = (now) => {
            frame = requestAnimationFrame(animate);
            if (now - last < 1000 / opt.fps) return;
            last = now;
            time += opt.drift;
            draw();
        };

        resize();
        window.addEventListener('resize', resize);
        document.body.addEventListener('click', handleClick);
        if (!reduceMotion) frame = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            document.body.removeEventListener('click', handleClick);
            if (frame) cancelAnimationFrame(frame);
        };
    }, []);

    return (
        <>
            {/* Canvas as background */}
            <canvas
                ref={canvasRef}
                id="bg-canvas"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 0,
                    display: 'block',
                    background: '#000',
                    imageRendering: 'pixelated',
                    pointerEvents: 'none'
                }}
            />
            
            {/* Content on top */}
            <main style={{ 
                position: 'relative', 
                zIndex: 10, 
                minHeight: '100vh',
                background: 'transparent'
            }}>
                <section id="home" className="section" style={{ background: 'transparent' }}>
                    <div className="home-content" style={{ background: 'transparent' }}>
                        <div className="home-row">
                            <div className="home-logo" role="img" aria-label="andrew hunter logo" style={{ WebkitMaskImage: logoMask, maskImage: logoMask }} />
                            <ul className="experience-list">
                                <li className="experience-heading">
                                    <h1 className="home-title">andrew hunter</h1> — <span className="home-subtitle">chasing the frontier</span>
                                </li>
                                <li>
                                    managing partner at <a href="https://www.rlty.ai/" target="_blank" rel="noopener noreferrer"><RltyLogo />rlty.ai</a> — a forward deployed agency for the whole real estate value chain
                                </li>
                                <li>
                                    deployed <a href="https://www.with.haus" target="_blank" rel="noopener noreferrer"><HausLogo />with.haus</a> — an ai operations company for staging operations
                                </li>
                                <li>
                                    founding engineer at <a href="https://www.nura.construction" target="_blank" rel="noopener noreferrer"><NuraLogo />nura.construction</a> — built the mvp to production, got no equity
                                </li>
                                <li>
                                    founding design partner at <span className="company-name" role="img" aria-label="vølund"><VolundLogo /></span> — building an agnostic design engineering firm for all frontiers
                                </li>
                            </ul>
                        </div>

                        <div className="home-contact">
                            <span>[<a href="mailto:andrew@rlty.ai">andrew@rlty.ai</a>]</span>
                            <span>[<a href="https://x.com/stackedlol" target="_blank" rel="noopener noreferrer">x</a>]</span>
                            <span>[<a href="https://calendly.com/realandrewhunter/rlty-partners-intro" target="_blank" rel="noopener noreferrer">book call</a>]</span>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

export default Home;
