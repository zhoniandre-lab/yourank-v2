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

    // API KEY RESMI GOOGLE
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
            // TAHAP 1: AMBIL DATA REKOMENDASI KOMPETITOR DARI YOUTUBE
            const ytUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(keyword)}&type=video&regionCode=${country}&relevanceLanguage=${lang}&key=${GOOGLE_KEY}`;
            const ytRes = await fetch(ytUrl);
            if (!ytRes.ok) throw new Error("Gagal mengambil data dari API YouTube.");
            const ytData = await ytRes.json();
            
            let comps = [];
            if (ytData.items && ytData.items.length > 0) {
                comps = ytData.items.map(i => ({ title: i.snippet.title, channel: i.snippet.channelTitle }));
                competitorList.innerHTML = comps.map(c => `<div style="margin-bottom:8px; padding:6px; background:#1e293b; border-radius:4px;"><b>${c.channel}</b>: ${c.title}</div>`).join('');
            } else {
                competitorList.innerHTML = '<div>Tidak ada kompetitor langsung, beralih ke analisis mandiri.</div>';
            }

            // TAHAP 2: PROSES LANGSUNG KE EMPIRE INTERN GOOGLE GEMINI AI
            bulletStatus.innerText = '🧠 Mentransfer data ke Core Intelligence...';
            
            const promptSistem = `Anda adalah sistem pakar SEO YouTube tingkat tinggi. Analisis kata kunci ini secara mendalam untuk mendominasi algoritma: "${keyword}". Target Negara: ${country}, Bahasa: ${lang}. 
            Gunakan data kompetitor saat ini sebagai pembanding: ${JSON.stringify(comps)}.
            
            Berikan respon WAJIB dalam format JSON murni tanpa hiasan markdown (TIDAK BOLEH menggunakan tanda \`\`\`json di awal atau \`\`\` di akhir) dengan struktur kunci tepat seperti ini:
            {
              "kategori": "Nama Kategori Konten",
              "analisis_semantik": "Penjelasan detail trik psikologi judul kompetitor dan strategi kita membajak traffic mereka",
              "judul_a": "Formula Judul Opsi A (Trik CTR Ekstrem/FOMO)",
              "judul_b": "Formula Judul Opsi B (Trik Pembajakan Rekomendasi Video Besar)",
              "deskripsi": "Deskripsi lengkap video beserta pembagian timestamps struktur retensi tinggi",
              "tags": "kata kunci, tag, terpisah koma mengunci metadata kompetitor",
              "jam_upload": "Rekomendasi jam tayang spesifik",
              "prompt_visual_16_9": "Konsep prompt gambar visual thumbnail beranda 16:9",
              "prompt_visual_9_16": "Konsep prompt gambar visual thumbnail shorts 9:16",
              "emergency_strategy": "Langkah konkret rombak metadata jika 1 jam pertama views mandek"
            }`;

            // Menggunakan endpoint resmi Google API dengan parameter mode no-cors diatur oleh manipulasi payload standar
            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_KEY}`;

            const aiRes = await fetch(geminiUrl, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: promptSistem }] }],
                    generationConfig: {
                        responseMimeType: "application/json"
                    }
                })
            });

            if (!aiRes.ok) throw new Error("Gagal terhubung ke server kecerdasan Google.");

            const aiData = await aiRes.json();
            
            if (!aiData.candidates || aiData.candidates.length === 0) {
                throw new Error("Respon kosong dari AI. Silakan coba lagi.");
            }

            let textResponse = aiData.candidates[0].content.parts[0].text;
            
            // Pembersihan jika AI mengembalikan teks dengan pembungkus markdown
            textResponse = textResponse.replace(/```json/g, "").replace(/```/g, "").trim();
            const payload = JSON.parse(textResponse);

            // TAMPILKAN HASILNYA KE LAYAR HP BOS
            semanticAnalysis.innerHTML = payload.analisis_semantik;
            fixTitle.innerHTML = `
                <div style="margin-bottom:12px; padding-bottom:6px; border-bottom:1px dashed #4b5563;"><b>[PILIHAN A - CTR TINGGI]</b><br>${payload.judul_a}</div>
                <div><b>[PILIHAN B - REKOMENDASI]</b><br>${payload.judul_b}</div>
            `;
            fixDesc.value = payload.deskripsi;
            fixTags.innerText = payload.tags;
            uploadTime.innerHTML = `🕒 JAM EKSEKUSI UTAMA: ${payload.jam_upload}`;

            emergencyBtn.dataset.strategy = payload.emergency_strategy;

            thumbLongCanvas.innerHTML = `<div style="background:#1e293b; padding:10px; font-size:12px; border:1px dashed #38bdf8; border-radius:4px;">${payload.prompt_visual_16_9}</div>`;
            thumbShortCanvas.innerHTML = `<div style="background:#1e293b; padding:10px; font-size:12px; border:1px dashed #ec4899; border-radius:4px;">${payload.prompt_visual_9_16}</div>`;
            
            bulletStatus.innerHTML = '<span style="color: #00FF00; font-weight: bold;">🟢 PENETRASI ALGORITMA SUKSES</span>';
            
        } catch (err) {
            console.error(err);
            bulletStatus.innerHTML = '<span style="color: #FF0000; font-weight: bold;">🔴 JALUR INFILTRASI TERPUTUS</span>';
            alert('Terjadi kesalahan komunikasi data: ' + err.message);
        } finally {
            auditBtn.disabled = false;
            auditBtn.innerText = 'TEMBAK PELURU ALGORITMA';
        }
    });

    emergencyBtn.addEventListener('click', () => {
        const strategy = emergencyBtn.dataset.strategy || "Segera rombak judul dan ganti thumbnail video Anda.";
        emergencyResult.classList.remove('hidden');
        emergencyResult.innerHTML = `<b>⚠️ STRATEGI PENYELAMATAN AKTIF:</b><br><br>${strategy}`;
    });
});
