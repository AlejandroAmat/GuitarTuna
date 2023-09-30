
function listen(){
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (stream) {
            const elem = document.getElementById("freq");
            const elemm = document.getElementById("ampl");
            const image = document.getElementById("myImage");
            image.style.width = "50px"; // Set the desired width in pixels
            image.style.height = "50px"
            const step=1.059454;
            mediaStream = stream;
            const audioContext = new AudioContext();
            let lastValue =0;
            //actualValue=1;
            times=0;
            const microphone = audioContext.createMediaStreamSource(stream);

            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 8192*4; // Set FFT size
            analyser.frequencyBinCount=8192*4;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            const timeDataArray = new Uint8Array(bufferLength);

            let avg_ampl=[];
            microphone.connect(analyser);
            

            function compute_nota(P){

                //encontrar más cercana//
                let cf = 440;
                izq = 440 / step;
                der = 440 * step;

                if(P>cf){
                        incl = (P-cf)/(der-cf)*60;
                }
                else{
                    incl = (P-cf)/(cf-izq)*60;
                }
                
                console.log(incl);
                return incl;

            }



            function findPitch(dataArray){
                let peakFrequency = 0; // Default to 0 Hz
                let peakAmplitude = 0; // Default to 0 (minimum amplitude)
                avg_ampl=0;
                // Iterate through the frequency data array
                for (let i = 0; i < dataArray.length; i++) {
                    const amplitude = dataArray[i];
                    const frequency = (i / dataArray.length) * audioContext.sampleRate / 2; // Calculate frequency in Hz
                    avg_ampl+= amplitude*amplitude;
                    
                    // Check if the current amplitude is greater than the previous peak
                    if (amplitude > peakAmplitude) {
                        peakAmplitude = amplitude;
                        peakFrequency = frequency;
                    }
                }
                avg_ampl= avg_ampl/dataArray.length;
                // Use peakFrequency and peakAmplitude as needed
                //console.log('Peak Frequency (Hz):', peakFrequency);
                
                if(lastValue!=peakFrequency){
                    lastValue==peakFrequency;
                    console.log(times);
                }
                
                power = avg_ampl;
                elemm.textContent = "Power = "+ power;

                if(parseInt(peakFrequency)*0.8<=parseInt(lastValue) && parseInt(peakFrequency)*1.2>=parseInt(lastValue)) times++;

                
                if(power>34 & times>40){

                    elem.textContent = "Frequency = "+ peakFrequency + "Hz";
                    incl = compute_nota(peakFrequency) + 90;
                    image.style.transform = `rotate(${incl}deg)`;
                    //actualValue = peakFrequency;
                    times=0;
                }
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

            performFFT();
            
        })
        .catch(function (error) {
           console.log(error)
        });
    }