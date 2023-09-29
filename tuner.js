
function listen(){
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (stream) {

            console.log("SI")
            mediaStream = stream;
            const audioContext = new AudioContext();
            
            const microphone = audioContext.createMediaStreamSource(stream);

            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048; // Set FFT size
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            
            microphone.connect(analyser);
            
            function findPitch(dataArray){
                let peakFrequency = 0; // Default to 0 Hz
                let peakAmplitude = 0; // Default to 0 (minimum amplitude)

                // Iterate through the frequency data array
                for (let i = 0; i < dataArray.length; i++) {
                    const amplitude = dataArray[i];
                    const frequency = (i / dataArray.length) * audioContext.sampleRate / 2; // Calculate frequency in Hz

                    // Check if the current amplitude is greater than the previous peak
                    if (amplitude > peakAmplitude) {
                        peakAmplitude = amplitude;
                        peakFrequency = frequency;
                    }
                }

                // Use peakFrequency and peakAmplitude as needed
                console.log('Peak Frequency (Hz):', peakFrequency);
                console.log('Peak Amplitude:', peakAmplitude);
            }

            function performFFT() {
                // Get the frequency data into dataArray
                
                 analyser.getByteFrequencyData(dataArray);
                findPitch(dataArray);
                // Process and analyze the FFT data as needed
                // For example, you can visualize or work with the frequency data here
    
                // Call this function recursively for real-time analysis
                requestAnimationFrame(performFFT);
            }

            console.log(performFFT());
            
        })
        .catch(function (error) {
           console.log(error)
        });
    }