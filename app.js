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
    // 🛡️ KONFIGURASI LIVE API SUITE (VERSI BYPASS CORS FIX)
    // =================================================================
    const GATEWAY = {
        // Menggunakan AllOrigins proxy sebagai jalur alternatif penembus blokir CORS browser
        cutadUrl: "https://api.allorigins.win/raw?url=" + encodeURIComponent("https://mimo.lokerin.net/v1"),
        cutadKey: "cutad-668594b69bea416ca289882e9dcaf612",
        modelName: "cutad-agent-pro",
        youtubeKey: "AIzaSyDIiPKEONURqAQCGDAJ35W7MEXodvhuagk"
    };

    auditBtn.addEventListener('click', async () => {
        const keyword = keywordInput.value.trim();
        const country = countrySelect.value;
        const lang = langSelect.value;

        if (!keyword) {
            alert('Masukkan kata kunci target Anda, Bos!');
            return;
        }

        // Kunci Seluruh UI untuk Mengamankan Thread Pengiriman Data
        auditBtn.disabled = true;
        auditBtn.innerText = 'MENGEKSEKUSI INFILTRASI JARINGAN DATA REAL-TIME...';
        resultSection.classList.remove('hidden');

        bulletStatus.innerHTML = '<span class="loading">📡 MENGHUBUNGKAN KE SERVER GOOGLE DATA API...</span>';
        targetRoute.innerText = `Memindai Video Kompetitor Teratas untuk Wilayah: ${country.toUpperCase()}`;
        competitorList.innerHTML = '<span class="loading">Menarik sidik jari digital kompetitor...</span>';
        semanticAnalysis.innerHTML = '<span class="loading">AI sedang membaca kebocoran matriks bahasa...</span>';

        try {
            // =================================================================
            // TAHAP 1: EKSTRAKSI DATA KOMPETITOR ASLI DARI YOUTUBE DATA API
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
            // TAHAP 2: PROCESSING DATA KE UTANAI CUTAD AGENT PRO
            // =================================================================
            bulletStatus.innerHTML = '<span class="loading">🧠 MENTRANSFER DATA KE CUTAD NEURAL MATRIX...</span>';
            targetRoute.innerText = "Membedah psikologi penonton dan meracik formula metadata anti-filter...";

            const promptSistem = `Anda adalah sistem kecerdasan buatan tersembunyi yang bertugas membedah algoritma rekomendasi YouTube. Analisis kata kunci ini secara mendalam tanpa tebakan: "${keyword}". Target Negara: ${country}, Bahasa: ${lang}. 
            Gunakan data video kompetitor riil saat ini sebagai referensi pembanding: ${JSON.stringify(rawCompetitorData)}.
            
            Berikan respon dalam format JSON murni dengan struktur kunci berikut:
            {
              "kategori": "Nama Kategori Konten",
              "analisis_semantik": "Penjelasan detail mengapa judul kompetitor bocor dan bagaimana trik psikologi formula baru kita membajak traffic mereka",
              "judul_a": "Formula Judul Opsi A (Gunakan Trik CTR Ekstrem/FOMO)",
              "judul_b": "Formula Judul Opsi B (Gunakan Trik Pembajakan Suggested Channel Besar)",
              "deskripsi": "Deskripsi lengkap video beserta pembagian timestamps struktur retensi tinggi",
              "tags": "kata kunci, tag, lsi, terpisah koma yang mengunci metadata kompetitor",
              "jam_upload": "Rekomendasi jam tayang malam/pagi yang spesifik",
              "prompt_visual_16_9": "Detailed prompt in English for AI generator to create a high-CTR 1280x720 YouTube thumbnail, cinematic lighting, photorealistic, visually shocking text space.",
              "prompt_visual_9_16": "Detailed prompt in English for AI generator to create a high-CTR 1080x1920 YouTube Shorts thumbnail, extreme macro or portrait format, strong emotional trigger.",
              "emergency_strategy": "Langkah konkret merombak metadata dalam 3 baris pertama jika 1 jam pertama views mandek"
            }`;

            // URL Endpoint dipadukan dengan AllOrigins Proxy untuk bypass CORS
            const targetApiUrl = "https://mimo.lokerin.net/v1/chat/completions";
            const proxyUrl = "https://api.allorigins.win/raw?url=" + encodeURIComponent(targetApiUrl);

            const cutadResponse = await fetch(proxyUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${GATEWAY.cutadKey}`
                },
                body: JSON.stringify({
                    model: GATEWAY.modelName,
                    messages: [
                        { role: "user", content: promptSistem }
                    ],
                    response_format: { type: "json_object" }
                })
            });

            if (!cutadResponse.ok) throw new Error("Gagal melakukan kontak dengan Cutad API Server.");

            const cutadData = await cutadResponse.json();
            const payload = JSON.parse(cutadData.choices[0].message.content);

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

            // Kunci strategi darurat ke memori internal tombol Modul 6
            emergencyBtn.dataset.strategy = payload.emergency_strategy;

            // =================================================================
            // TAHAP 3: GENERATOR IMAGES VIA API CUTAD (RENDERING VISUAL)
            // =================================================================
            await generateVisualThumbnail(payload.prompt_visual_16_9, payload.prompt_visual_9_16, GATEWAY.cutadKey);

        } catch (error) {
            console.error(error);
            bulletStatus.innerHTML = '<span style="color: #FF0000; font-weight: bold;">🔴 JALUR INFILTRASI TERPUTUS / ERROR</span>';
            targetRoute.innerText = `Error Log: ${error.message}. Periksa koneksi internet atau status kuota API Anda.`;
        } finally {
            auditBtn.disabled = false;
            auditBtn.innerText = 'TEMBAK PELURU ALGORITMA GLOBAL';
        }
    });

    // FUNGSI UTAMA GENERATOR GAMBAR REAL-TIME (16:9 & 9:16)
    async function generateVisualThumbnail(promptLong, promptShort, token) {
        thumbLongCanvas.innerHTML = '<span class="loading">Mengeksekusi Render Gambar Beranda (16:9)...</span>';
        thumbShortCanvas.innerHTML = '<span class="loading">Mengeksekusi Render Gambar Shorts (9:16)...</span>';

        const targetImgUrl = "https://mimo.lokerin.net/v1/images/generations";
        const proxyImgUrl = "https://api.allorigins.win/raw?url=" + encodeURIComponent(targetImgUrl);

        try {
            // Request Pembuatan Gambar Beranda (16:9)
            const resLong = await fetch(proxyImgUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    prompt: promptLong,
                    n: 1,
                    size: "1280x720"
                })
            });
            const dataLong = await resLong.json();
            const urlLong = dataLong.data[0].url;
            thumbLongCanvas.innerHTML = `<img src="${urlLong}" style="width:100%; border-radius:6px; display:block;">`;
            setupDownload(downloadLongBtn, urlLong, "thumbnail_long_16_9.png");

            // Request Pembuatan Gambar Shorts (9:16)
            const resShort = await fetch(proxyImgUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    prompt: promptShort,
                    n: 1,
                    size: "1080x1920"
                })
            });
            const dataShort = await resShort.json();
            const urlShort = dataShort.data[0].url;
            thumbShortCanvas.innerHTML = `<img src="${urlShort}" style="width:100%; max-height:250px; object-fit:cover; border-radius:6px; display:block; margin:0 auto;">`;
            setupDownload(downloadShortBtn, urlShort, "thumbnail_shorts_9_16.png");

        } catch (err) {
            console.error(err);
            thumbLongCanvas.innerHTML = '<div class="error-box">Gagal melahirkan visual 16:9 via API. Pastikan endpoint mendukung modul gambar.</div>';
            thumbShortCanvas.innerHTML = '<div class="error-box">Gagal melahirkan visual 9:16 via API. Pastikan endpoint mendukung modul gambar.</div>';
        }
    }

    function setupDownload(btn, url, name) {
        btn.disabled = false;
        btn.onclick = () => {
            const link = document.createElement('a');
            link.href = url;
            link.download = name;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
    }

    // MODUL 6: EKSEKUSI STRATEGI REKALIBRASI EMERGENCY 1 JAM
    emergencyBtn.addEventListener('click', () => {
        const strategy = emergencyBtn.dataset.strategy || "Segera rombak 3 kata pertama judul video Anda dan ganti warna latar thumbnail dengan kombinasi kuning stabilo kontras.";
        emergencyResult.classList.remove('hidden');
        emergencyResult.innerHTML = `<b>⚠️ RE-INJEKSI SISTEM PENYELAMATAN AKTIF (REAL-TIME ADAPTIVE):</b><br><br>${strategy}`;
        emergencyBtn.innerText = 'STRATEGI BYPASS BERHASIL DISUNTIKKAN!';
    });
});
