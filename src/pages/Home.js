// src/pages/Home.js
import React, { useEffect, useRef } from 'react';
import SocialButtons from '../components/SocialButtons';
import '../styles/Home.css';

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
    const animationRef = useRef(null);
    const particlesRef = useRef([]);
    const optRef = useRef(null);
    const perlinRef = useRef(null);
    const timeRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Initialize Perlin noise
        perlinRef.current = new PerlinNoise();

        const rand = (v1, v2) => Math.floor(v1 + Math.random() * (v2 - v1));
        const deg = (a) => Math.PI / 180 * a;

        // Options - using white/grey colors instead of HSL
        optRef.current = {
            particles: window.innerWidth > 500 ? 300 : 150,
            noiseScale: 0.003,
            angle: deg(-90),
            strokeWeight: 0.8,
            tail: 85,
        };

        const opt = optRef.current;

        // Particle class with history for longer strings
        class Particle {
            constructor(x, y, width, height) {
                this.width = width;
                this.height = height;
                this.x = x;
                this.y = y;
                this.vx = 0;
                this.vy = 0;
                this.ax = 0;
                this.ay = 0;
                this.historyLength = rand(15, 40);
                this.history = [];
                this.randomize();
            }

            randomize() {
                this.hueSemen = Math.random();
                this.lightness = this.hueSemen > 0.5 ? rand(60, 100) : rand(30, 60);
                this.maxSpeed = this.hueSemen > 0.5 ? 0.8 : 0.5;
                this.historyLength = rand(15, 40);
            }

            update() {
                this.follow();

                this.vx += this.ax;
                this.vy += this.ay;

                const p = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                const a = Math.atan2(this.vy, this.vx);
                const m = Math.min(this.maxSpeed, p);
                this.vx = Math.cos(a) * m;
                this.vy = Math.sin(a) * m;

                // Store position in history
                this.history.push({ x: this.x, y: this.y });
                if (this.history.length > this.historyLength) {
                    this.history.shift();
                }

                this.x += this.vx;
                this.y += this.vy;
                this.ax = 0;
                this.ay = 0;

                this.edges();
            }

            follow() {
                const noise = perlinRef.current.noise(
                    this.x * opt.noiseScale,
                    this.y * opt.noiseScale,
                    timeRef.current * opt.noiseScale
                );
                const angle = noise * Math.PI * 0.5 + opt.angle;

                this.ax += Math.cos(angle);
                this.ay += Math.sin(angle);
            }

            edges() {
                if (this.x < 0) {
                    this.x = this.width;
                    this.history = [];
                }
                if (this.x > this.width) {
                    this.x = 0;
                    this.history = [];
                }
                if (this.y < 0) {
                    this.y = this.height;
                    this.history = [];
                }
                if (this.y > this.height) {
                    this.y = 0;
                    this.history = [];
                }
            }

            render(ctx) {
                if (this.history.length < 2) return;

                ctx.beginPath();
                ctx.moveTo(this.history[0].x, this.history[0].y);

                for (let i = 1; i < this.history.length; i++) {
                    ctx.lineTo(this.history[i].x, this.history[i].y);
                }
                ctx.lineTo(this.x, this.y);

                // Gradient along the string
                const alpha = this.lightness / 250;
                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.lineWidth = opt.strokeWeight;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.stroke();
            }
        }

        // Set canvas size and init particles
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particlesRef.current = [];
            for (let i = 0; i < opt.particles; i++) {
                particlesRef.current.push(
                    new Particle(
                        Math.random() * canvas.width,
                        Math.random() * canvas.height,
                        canvas.width,
                        canvas.height
                    )
                );
            }
        };

        // Click handler to randomize
        const handleClick = () => {
            opt.angle += deg(rand(30, 90)) * (Math.random() > 0.5 ? 1 : -1);
            for (let p of particlesRef.current) {
                p.randomize();
            }
        };

        // Animation loop
        const animate = () => {
            timeRef.current++;

            // Trail effect
            ctx.fillStyle = `rgba(0, 0, 0, ${(100 - opt.tail) / 100})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.lineWidth = opt.strokeWeight;

            for (let p of particlesRef.current) {
                p.update();
                p.render(ctx);
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        // Start
        resize();
        window.addEventListener('resize', resize);
        document.body.addEventListener('click', handleClick);
        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', resize);
            document.body.removeEventListener('click', handleClick);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
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
                        <h1 className="home-title">andrewhunter</h1>
                        <p className="subtitle">building on the internet</p>
                        
                        <ul className="experience-list">
                            <li>
                                full stack engineer at <a href="https://www.nura.construction" target="_blank" rel="noopener noreferrer">nura.construction</a> — building an intelligence layer for real estate developers
                            </li>
                            <li>
                                founder of <a href="https://carcodes.xyz" target="_blank" rel="noopener noreferrer">carcodes.xyz</a> — a b2c web app built with nextjs for car enthusiasts that was rug pulled
                            </li>
                            <li>
                                creator of sandbox ui — a react component library, try it with <span className="underline-white">npx create-sandbox-ui@latest my-app</span>
                            </li>
                        </ul>
                        
                        <SocialButtons />
                    </div>
                </section>
            </main>
        </>
    );
}

export default Home;
