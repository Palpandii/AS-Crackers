// Tiny "pop + crackle" sound for Add / + buttons.
// Generated with the Web Audio API → no mp3 file, no path problems.
let ctx = null

function getCtx() {
    if (typeof window === 'undefined') return null
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    if (!ctx) ctx = new AC()
    return ctx
}

export function playClickSound() {
    try {
        const ac = getCtx()
        if (!ac) return
        // Browsers keep audio "suspended" until a user gesture — this is why sounds often stay silent.
        if (ac.state === 'suspended') ac.resume()

        const now = ac.currentTime

        // 1) quick pitch-drop "pop"
        const osc = ac.createOscillator()
        const oscGain = ac.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(520, now)
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.12)
        oscGain.gain.setValueAtTime(0.0001, now)
        oscGain.gain.exponentialRampToValueAtTime(0.35, now + 0.01)
        oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14)
        osc.connect(oscGain).connect(ac.destination)
        osc.start(now)
        osc.stop(now + 0.15)

        // 2) short noise burst = cracker "crackle"
        const len = Math.floor(ac.sampleRate * 0.08)
        const buf = ac.createBuffer(1, len, ac.sampleRate)
        const data = buf.getChannelData(0)
        for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len)
        const noise = ac.createBufferSource()
        const noiseGain = ac.createGain()
        const hp = ac.createBiquadFilter()
        hp.type = 'highpass'
        hp.frequency.value = 1800
        noise.buffer = buf
        noiseGain.gain.value = 0.18
        noise.connect(hp).connect(noiseGain).connect(ac.destination)
        noise.start(now)
    } catch {
        /* sound is optional — never break the Add button */
    }
}