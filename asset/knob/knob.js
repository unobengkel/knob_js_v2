/**
 * Reusable Knob Component
 * Logic extracted and modularized from knob_js.html
 */

class Knob {
    constructor(canvasElement, options = {}) {
        if (!canvasElement) {
            console.error('Knob: Canvas element is required');
            return;
        }

        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');
        
        // Configuration
        this.baseSize = options.baseSize || 300;
        this.currentValue = options.initialValue !== undefined ? options.initialValue : 65;
        this.onValueChange = options.onValueChange || null;
        
        // Colors and Styles (optional to make these configurable later)
        this.colors = {
            active: '#2563eb',
            inactive: '#cbd5e1',
            text: '#1f2937',
            rimGradient: ['#94a3b8', '#475569'],
            innerGradient: ['#f8fafc', '#94a3b8'],
            ridges: '#64748b'
        };

        this.isDragging = false;
        this.cx = this.baseSize / 2;
        this.cy = this.baseSize / 2;

        this.init();
    }

    init() {
        // Setup Canvas for High DPI
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.baseSize * dpr;
        this.canvas.height = this.baseSize * dpr;
        this.ctx.scale(dpr, dpr);

        // Bind event handlers
        this.onStart = this.onStart.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onEnd = this.onEnd.bind(this);

        this.addEventListeners();
        this.draw();
    }

    addEventListeners() {
        // Mouse Events
        this.canvas.addEventListener('mousedown', this.onStart);
        window.addEventListener('mousemove', this.onMove);
        window.addEventListener('mouseup', this.onEnd);

        // Touch Events
        this.canvas.addEventListener('touchstart', this.onStart, { passive: false });
        window.addEventListener('touchmove', this.onMove, { passive: false });
        window.addEventListener('touchend', this.onEnd);
    }

    // Drawing Logic
    draw() {
        const { ctx, baseSize, cx, cy, currentValue, colors } = this;
        ctx.clearRect(0, 0, baseSize, baseSize);

        const tickRadiusOuter = 125;
        const tickRadiusInner = 112;
        const tickRadiusInnerLong = 105;
        
        const startAngleDeg = 135;
        const endAngleDeg = 405;
        const rangeDeg = endAngleDeg - startAngleDeg;
        
        const startRad = startAngleDeg * Math.PI / 180;
        const endRad = endAngleDeg * Math.PI / 180;
        const totalTicks = 40;

        // 1. Ticks
        for (let i = 0; i <= totalTicks; i++) {
            const rad = startRad + (i / totalTicks) * (rangeDeg * Math.PI / 180);
            const valAtTick = (i / totalTicks) * 100;
            
            const isBlue = valAtTick <= currentValue;
            const isLong = i % 5 === 0;

            ctx.beginPath();
            const innerR = isLong ? tickRadiusInnerLong : tickRadiusInner;
            ctx.moveTo(cx + Math.cos(rad) * innerR, cy + Math.sin(rad) * innerR);
            ctx.lineTo(cx + Math.cos(rad) * tickRadiusOuter, cy + Math.sin(rad) * tickRadiusOuter);

            ctx.lineWidth = isLong ? 2.5 : 1.5;
            ctx.strokeStyle = isBlue ? colors.active : colors.inactive;
            ctx.stroke();
        }

        // 2. Numbers "0" and "100"
        ctx.font = '500 14px system-ui, sans-serif';
        ctx.fillStyle = colors.text;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('0', cx + Math.cos(startRad) * 145, cy + Math.sin(startRad) * 145);
        ctx.fillText('100', cx + Math.cos(endRad) * 145, cy + Math.sin(endRad) * 145);

        // 3. Knob Body (Metallic Effect)
        const knobRadius = 85;

        // Drop Shadow
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetY = 8;
        ctx.beginPath();
        ctx.arc(cx, cy, knobRadius, 0, Math.PI * 2);
        ctx.fillStyle = colors.inactive;
        ctx.fill();
        ctx.restore();

        // Outer Rim
        const gradientRim = ctx.createLinearGradient(cx - knobRadius, cy - knobRadius, cx + knobRadius, cy + knobRadius);
        gradientRim.addColorStop(0, colors.rimGradient[0]);
        gradientRim.addColorStop(1, colors.rimGradient[1]);
        ctx.beginPath();
        ctx.arc(cx, cy, knobRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradientRim;
        ctx.fill();

        // Inner Surface
        const innerRadius = knobRadius - 8;
        const gradientInner = ctx.createLinearGradient(cx - innerRadius, cy - innerRadius, cx + innerRadius, cy + innerRadius);
        gradientInner.addColorStop(0, colors.innerGradient[0]);
        gradientInner.addColorStop(1, colors.innerGradient[1]);
        ctx.beginPath();
        ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradientInner;
        ctx.fill();

        // Ridges
        for (let i = 0; i < 60; i++) {
            const rad = i * (Math.PI * 2) / 60;
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(rad) * (knobRadius - 7), cy + Math.sin(rad) * (knobRadius - 7));
            ctx.lineTo(cx + Math.cos(rad) * knobRadius, cy + Math.sin(rad) * knobRadius);
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = colors.ridges;
            ctx.stroke();
        }

        // 4. Indicator Line
        const indicatorAngle = startRad + (currentValue / 100) * (rangeDeg * Math.PI / 180);
        ctx.beginPath();
        const indStartR = 25;
        const indEndR = innerRadius - 10;
        ctx.moveTo(cx + Math.cos(indicatorAngle) * indStartR, cy + Math.sin(indicatorAngle) * indStartR);
        ctx.lineTo(cx + Math.cos(indicatorAngle) * indEndR, cy + Math.sin(indicatorAngle) * indEndR);
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.strokeStyle = colors.active;
        ctx.stroke();
    }

    calculateAngle(x, y) {
        const rect = this.canvas.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const dx = x - centerX;
        const dy = y - centerY;
        
        let angleDeg = Math.atan2(dy, dx) * 180 / Math.PI;
        if (angleDeg < 0) angleDeg += 360;

        let shiftedAngle = angleDeg - 135;
        if (shiftedAngle < 0) shiftedAngle += 360;

        if (shiftedAngle <= 270) {
            this.currentValue = (shiftedAngle / 270) * 100;
        } else {
            if (shiftedAngle > 315) {
                this.currentValue = 0;
            } else {
                this.currentValue = 100;
            }
        }

        this.currentValue = Math.max(0, Math.min(100, this.currentValue));
        
        if (this.onValueChange) {
            this.onValueChange(this.currentValue);
        }
        
        this.draw();
    }

    onStart(e) {
        this.isDragging = true;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        this.calculateAngle(clientX, clientY);
    }

    onMove(e) {
        if (!this.isDragging) return;
        if (e.cancelable) e.preventDefault();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        this.calculateAngle(clientX, clientY);
    }

    onEnd() {
        this.isDragging = false;
    }

    getValue() {
        return this.currentValue;
    }

    setValue(val) {
        this.currentValue = Math.max(0, Math.min(100, val));
        this.draw();
    }
}
