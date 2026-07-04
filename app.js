document.addEventListener('DOMContentLoaded', () => {
    const keywordInput = document.getElementById('keywordInput');
    const countrySelect = document.getElementById('countrySelect');
    const langSelect = document.getElementById('langSelect');
    const auditBtn = document.getElementById('auditBtn');
    const resultSection = document.getElementById('resultSection');
    const bulletStatus = document.getElementById('bulletStatus');
    const targetRoute = document.getElementById('targetRoute');
    const competitorList = document.getElementById('competitorList');
    const semanticAnalysis = document.getElementById('semanticAnalysis');
    const fixTitle = document.getElementById('fixTitle');
    const fixDesc = document.getElementById('fixDesc');
    const fixTags = document.getElementById('fixTags');
    const uploadTime = document.getElementById('uploadTime');
    const thumbLongCanvas = document.getElementById('thumbLongCanvas');
    const thumbShortCanvas = document.getElementById('thumbShortCanvas');
    const emergencyBtn = document.getElementById('emergencyBtn');
    const emergencyResult = document.getElementById('emergencyResult');

    const GOOGLE_KEY = "AIzaSyDIiPKEONURqAQCGDAJ35W7MEXodvhuagk";

    auditBtn.addEventListener('click', async () => {
        const keyword = keywordInput.value.trim();
        const country = countrySelect.value;
        const lang = langSelect.value;

        if (!keyword) {
            alert('Masukkan kata kunci dulu, Bos!');
            return;
        }

        auditBtn.disabled = true;
        auditBtn.innerText = 'MENJALANKAN ANALISIS DATA...';
        resultSection.classList.remove('hidden');

        try {
            // TAHAP 1: YOUTUBE API
            const ytUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(keyword)}&type=video&regionCode=${country}&relevanceLanguage=${lang}&key=${GOOGLE_KEY}`;
            const ytRes = await fetch(ytUrl);
            const ytData = await ytRes.json();
            
            let comps = ytData.items.map(i => ({ title: i.snippet.title, channel: i.snippet.channelTitle }));
            competitorList.innerHTML = comps.map(c => `<div><b>${c.channel}</b>: ${c.title}</div>`).join('');

            // TAHAP 2: GEMINI AI VIA JEMBATAN ANTI-CORS
            bulletStatus.innerText = '🧠 Membedah algoritma...';
            
            const prompt = `Analisis keyword "${keyword}" untuk negara ${country}. Berikan respon JSON murni: { "kategori": "", "analisis_semantik": "", "judul_a": "", "judul_b": "", "deskripsi": "", "tags": "", "jam_upload": "", "prompt_visual_16_9": "", "prompt_visual_9_16": "", "emergency_strategy": "" }`;
            
            const geminiTarget = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_KEY}`;
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(geminiTarget + '&method=POST&body=' + JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }))}`;

            const aiRes = await fetch(proxyUrl);
            const aiData = await aiRes.json();
            const payload = JSON.parse(JSON.parse(aiData.contents).candidates[0].content.parts[0].text.replace(/```json/g, "").replace(/```/g, ""));

            // TAMPILAN
            semanticAnalysis.innerText = payload.analisis_semantik;
            fixTitle.innerHTML = `A: ${payload.judul_a}<br><br>B: ${payload.judul_b}`;
            fixDesc.value = payload.deskripsi;
            fixTags.innerText = payload.tags;
            uploadTime.innerText = payload.jam_upload;
            thumbLongCanvas.innerText = payload.prompt_visual_16_9;
            thumbShortCanvas.innerText = payload.prompt_visual_9_16;
            emergencyBtn.dataset.strategy = payload.emergency_strategy;
            bulletStatus.innerText = '✅ Analisis Selesai!';
            
        } catch (err) {
            bulletStatus.innerText = '❌ Error: ' + err.message;
        } finally {
            auditBtn.disabled = false;
            auditBtn.innerText = 'TEMBAK PELURU ALGORITMA';
        }
    });

    emergencyBtn.addEventListener('click', () => {
        emergencyResult.classList.remove('hidden');
        emergencyResult.innerText = emergencyBtn.dataset.strategy;
    });
});
