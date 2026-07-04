document.addEventListener('DOMContentLoaded', () => {
    // Definisi Elemen DOM UI
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
    const downloadLongBtn = document.getElementById('downloadLongBtn');
    const downloadShortBtn = document.getElementById('downloadShortBtn');
    
    const emergencyBtn = document.getElementById('emergencyBtn');
    const emergencyResult = document.getElementById('emergencyResult');

    // =================================================================
    // 🛡️ KONFIGURASI LIVE ANTI-CORS VIA VERCEL INTERNAL PROXY REWRITE
    // =================================================================
    const GATEWAY = {
        youtubeKey: "AIzaSyDIiPKEONURqAQCGDAJ35W7MEXodvhuagk",
        // Menembak proksi internal Vercel untuk mengelabui proteksi CORS browser
        geminiProxyUrl: window.location.origin + "/api-gemini/v1beta/models/gemini-1.5-flash:generateContent"
    };

    auditBtn.addEventListener('click', async () => {
        const keyword = keywordInput.value.trim();
        const country = countrySelect.value;
        const lang = langSelect.value;

        if (!keyword) {
            alert('Masukkan kata kunci target Anda, Bos!');
            return;
        }

        auditBtn.disabled = true;
        auditBtn.innerText = 'MENGEKSEKUSI INFILTRASI JARINGAN DATA REAL-TIME...';
        resultSection.classList.remove('hidden');

        bulletStatus.innerHTML = '<span class="loading">📡 MENGHUBUNGKAN KE SERVER GOOGLE DATA API...</span>';
        targetRoute.innerText = `Memindai Video Kompetitor Teratas untuk Wilayah: ${country.toUpperCase()}`;
        competitorList.innerHTML = '<span class="loading">Menarik sidik jari digital kompetitor...</span>';
        semanticAnalysis.innerHTML = '<span class="loading">AI sedang membaca kebocoran matriks bahasa...</span>';

        try {
            // =================================================================
            // TAHAP 1: EKSTRAKSI DATA KOMPETITOR ASLI
            // =================================================================
            const ytSearchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(keyword)}&type=video&regionCode=${country}&relevanceLanguage=${lang}&key=${GATEWAY.youtubeKey}`;
            
            const ytResponse = await fetch(ytSearchUrl);
            if (!ytResponse.ok) throw new Error("Gagal mengambil data dari API YouTube.");
            
            const ytData = await ytResponse.json();
            let rawCompetitorData = [];
            let compHTML = "";

            if (ytData.items && ytData.items.length > 0) {
                ytData.items.forEach((item, idx) => {
                    const title = item.snippet.title;
                    const channel = item.snippet.channelTitle;
                    const videoId = item.id.videoId;
                    rawCompetitorData.push({ rank: idx + 1, title: title, channel: channel });
                    
                    compHTML += `
                        <div class="list-item">
                            <b>[RANK #${idx+1}]</b> ${channel} <br> 
                            <span style="color:#94a3b8; font-size:10px;">Judul: ${title}</span><br>
                            <a href="https://youtu.be/${videoId}" target="_blank" style="color:#38bdf8; text-decoration:none; font-size:10px;">🔗 Lihat Video</a>
                        </div>`;
                });
                competitorList.innerHTML = compHTML;
            } else {
                competitorList.innerHTML = "<div class='error-box'>Tidak ada video kompetitor yang ditemukan. Jalur data otomatis dialihkan ke pemrosesan mandiri.</div>";
            }

            // =================================================================
            // TAHAP 2: PROCESSING VIA GOOGLE GEMINI PROXY (ANTI-CORS)
            // =================================================================
            bulletStatus.innerHTML = '<span class="loading">🧠 MENTRANSFER DATA KE GOOGLE COGNITIVE NEURAL...</span>';
            targetRoute.innerText = "Membedah psikologi penonton dan meracik formula metadata anti-filter...";

            const promptSistem = `Anda adalah sistem kecerdasan buatan tersembunyi yang bertugas membedah algoritma rekomendasi YouTube. Analisis kata kunci ini secara mendalam tanpa tebakan: "${keyword}". Target Negara: ${country}, Bahasa: ${lang}. 
            Gunakan data video kompetitor riil saat ini sebagai referensi pembanding: ${JSON.stringify(rawCompetitorData)}.
            
            Berikan respon WAJIB dalam format JSON murni tanpa hiasan markdown (tanpa kata \`\`\`json di awal) dengan struktur kunci persis seperti berikut ini:
            {
              "kategori": "Nama Kategori Konten",
              "analisis_semantik": "Penjelasan detail mengapa judul kompetitor bocor dan bagaimana trik psikologi formula baru kita membajak traffic mereka",
              "judul_a": "Formula Judul Opsi A (Gunakan Trik CTR Ekstrem/FOMO)",
              "judul_b": "Formula Judul Opsi B (Gunakan Trik Pembajakan Suggested Channel Besar)",
              "deskripsi": "Deskripsi lengkap video beserta pembagian timestamps struktur retensi tinggi",
              "tags": "kata kunci, tag, lsi, terpisah koma yang mengunci metadata kompetitor",
              "jam_upload": "Rekomendasi jam tayang malam/pagi yang spesifik",
              "prompt_visual_16_9": "Scary and shocking photorealistic concept image, high-contrast, for a highly viral thumbnail",
              "prompt_visual_9_16": "Vertical phone wallpaper style portrait, emotional expression, high contrast",
              "emergency_strategy": "Langkah konkret merombak metadata dalam 3 baris pertama jika 1 jam pertama views mandek"
            }`;

            // Panggilan aman lewat Proksi internal Vercel
            const aiResponse = await fetch(`${GATEWAY.geminiProxyUrl}?key=${GATEWAY.youtubeKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: promptSistem }] }],
                    generationConfig: { responseMimeType: "application/json" }
                })
            });

            if (!aiResponse.ok) throw new Error("Gagal melakukan kontak dengan Core Intelligence Server via Proxy.");

            const aiData = await aiResponse.json();
            const textResponse = aiData.candidates[0].content.parts[0].text;
            const payload = JSON.parse(textResponse.trim());

            // Tampilkan Hasil Pemrosesan ke Dasbor HP Bos
            bulletStatus.innerHTML = `<span style="color: #00FF00; font-weight: bold;">🟢 PENETRASI SUKSES: KATEGORI ${payload.kategori.toUpperCase()}</span>`;
            targetRoute.innerHTML = `Metadata berhasil disinkronkan dengan cluster penonton ${country.toUpperCase()}.`;

            semanticAnalysis.innerHTML = payload.analisis_semantik;
            
            fixTitle.innerHTML = `
                <div style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px dashed #374151;"><b>[PILIHAN A - CTR EKSTREM]</b><br>${payload.judul_a}</div>
                <div><b>[PILIHAN B - PEMBAJAKAN REKOMENDASI]</b><br>${payload.judul_b}</div>
            `;
            fixDesc.value = payload.deskripsi;
            fixTags.innerText = payload.tags;
            uploadTime.innerHTML = `🕒 JAM EKSEKUSI UTAMA: ${payload.jam_upload}`;

            emergencyBtn.dataset.strategy = payload.emergency_strategy;

            // Render Prompt Visual Instan untuk Thumbnails
            thumbLongCanvas.innerHTML = `<div style="background:#1e293b; color:#38bdf8; height:150px; display:flex; align-items:center; justify-content:center; text-align:center; font-size:12px; border:2px dashed #38bdf8; padding:10px; border-radius:6px; overflow-y:auto;"><b>[PROMPT VISUAL BERANDA 16:9]</b><br>${payload.prompt_visual_16_9}</div>`;
            thumbShortCanvas.innerHTML = `<div style="background:#1e293b; color:#ec4899; height:150px; display:flex; align-items:center; justify-content:center; text-align:center; font-size:12px; border:2px dashed #ec4899; padding:10px; border-radius:6px; overflow-y:auto;"><b>[PROMPT VISUAL SHORTS 9:16]</b><br>${payload.prompt_visual_9_16}</div>`;

        } catch (error) {
            console.error(error);
            bulletStatus.innerHTML = '<span style="color: #FF0000; font-weight: bold;">🔴 JALUR INFILTRASI TERPUTUS / ERROR</span>';
            targetRoute.innerText = `Error Log: ${error.message}. Hubungi pusat data kembali.`;
        } finally {
            auditBtn.disabled = false;
            auditBtn.innerText = 'TEMBAK PELURU ALGORITMA GLOBAL';
        }
    });

    // MODUL 6: EMERGENCY 1 JAM
    emergencyBtn.addEventListener('click', () => {
        const strategy = emergencyBtn.dataset.strategy || "Segera rombak 3 kata pertama judul video Anda dan ganti warna latar thumbnail dengan kombinasi kuning stabilo kontras.";
        emergencyResult.classList.remove('hidden');
        emergencyResult.innerHTML = `<b>⚠️ RE-INJEKSI SISTEM PENYELAMATAN AKTIF (REAL-TIME ADAPTIVE):</b><br><br>${strategy}`;
        emergencyBtn.innerText = 'STRATEGI BYPASS BERHASIL DISUNTIKKAN!';
    });
});
