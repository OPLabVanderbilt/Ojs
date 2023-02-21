const trials = [
    {
        "TrialN": 1,
        "Target": "sbj8-laugh5-1s.wav",
        "Choice1": "sbj8-laugh32-5s.wav",
        "Choice2": "sbj21-laugh5-1s.wav",
        "CorrRes": 1
    },
    {
        "TrialN": 2,
        "Target": "sbj9-laugh22-2s.wav",
        "Choice1": "sbj11-laugh46-1s.wav",
        "Choice2": "sbj9-laugh38-1s.wav",
        "CorrRes": 2
    },
    {
        "TrialN": 3,
        "Target": "sbj9-laugh7-2s.wav",
        "Choice1": "sbj8-laugh8-2s.wav",
        "Choice2": "sbj9-laugh35-2s.wav",
        "CorrRes": 2
    },
    {
        "TrialN": 4,
        "Target": "sbj11-laugh35-1s.wav",
        "Choice1": "sbj19-laugh3-1s.wav",
        "Choice2": "sbj11-laugh8-1s.wav",
        "CorrRes": 2
    },
    {
        "TrialN": 5,
        "Target": "FS201S7.WAV",
        "Choice1": "FS201S5.WAV",
        "Choice2": "FS104D11.WAV",
        "CorrRes": 1
    },
    {
        "TrialN": 6,
        "Target": "FS125D3.WAV",
        "Choice1": "FS125D4.WAV",
        "Choice2": "FS200D1.WAV",
        "CorrRes": 1
    },
    {
        "TrialN": 7,
        "Target": "session120participant318-0840_1.wav",
        "Choice1": "session120participant318-R07_1.wav",
        "Choice2": "session135participant342-1225_1.wav",
        "CorrRes": 1
    },
    {
        "TrialN": 8,
        "Target": "sbj8-laugh14-5s.wav",
        "Choice1": "sbj8-laugh33-2s.wav",
        "Choice2": "sbj11-laugh24-4s.wav",
        "CorrRes": 1
    },
    {
        "TrialN": 9,
        "Target": "sbj4-laugh37-1s.wav",
        "Choice1": "sbj4-laugh48-2s.wav",
        "Choice2": "sbj19-laugh9-1s.wav",
        "CorrRes": 1
    },
    {
        "TrialN": 10,
        "Target": "2_real_BL.wav",
        "Choice1": "3_posed_PD.wav",
        "Choice2": "3_posed_BL.wav",
        "CorrRes": 2
    },
    {
        "TrialN": 11,
        "Target": "2_posed_BL.wav",
        "Choice1": "3_real_AJ.wav",
        "Choice2": "3_real_BL.wav",
        "CorrRes": 2
    },
    {
        "TrialN": 12,
        "Target": "session128participant330-1818_4.wav",
        "Choice1": "session130participant333-1818_4.wav",
        "Choice2": "session128participant330-R04_2.wav",
        "CorrRes": 2
    },
    {
        "TrialN": 13,
        "Target": "sbj15-laugh1-2s.wav",
        "Choice1": "sbj3-laugh29-2s.wav",
        "Choice2": "sbj15-laugh4-1s.wav",
        "CorrRes": 2
    },
    {
        "TrialN": 14,
        "Target": "2_posed_CM.wav",
        "Choice1": "1_real_PD.wav",
        "Choice2": "1_real_CM.wav",
        "CorrRes": 2
    },
    {
        "TrialN": 15,
        "Target": "session20participant137-0432_1.wav",
        "Choice1": "session20participant137-1800_2.wav",
        "Choice2": "session22participant140-0283_1.wav",
        "CorrRes": 1
    },
    {
        "TrialN": 16,
        "Target": "2_posed_LM.wav",
        "Choice1": "4_posed_LM.wav",
        "Choice2": "3_posed_AJ.wav",
        "CorrRes": 1
    },
    {
        "TrialN": 17,
        "Target": "FS131S17.WAV",
        "Choice1": "FS131S8.WAV",
        "Choice2": "FS219S7.WAV",
        "CorrRes": 1
    },
    {
        "TrialN": 18,
        "Target": "session16participant126-0741_1.wav",
        "Choice1": "session14participant124-0003_2.wav",
        "Choice2": "session16participant126-0993_2.wav",
        "CorrRes": 2
    },
    {
        "TrialN": 19,
        "Target": "FS221D12.WAV",
        "Choice1": "FS221D2.WAV",
        "Choice2": "FS163D2.WAV",
        "CorrRes": 1
    },
    {
        "TrialN": 20,
        "Target": "sbj7-laugh5-1s.wav",
        "Choice1": "sbj14-laugh16-1s.wav",
        "Choice2": "sbj7-laugh9-1s.wav",
        "CorrRes": 2
    },
    {
        "TrialN": 21,
        "Target": "FS182S4.WAV",
        "Choice1": "FS158S4.WAV",
        "Choice2": "FS182S6.WAV",
        "CorrRes": 2
    },
    {
        "TrialN": 22,
        "Target": "sbj4-laugh30-1s.wav",
        "Choice1": "sbj3-laugh8-2s.wav",
        "Choice2": "sbj4-laugh47-2s.wav",
        "CorrRes": 2
    },
    {
        "TrialN": 23,
        "Target": "sbj9-laugh8-4s.wav",
        "Choice1": "sbj9-laugh20-2s.wav",
        "Choice2": "sbj8-laugh21-3s.wav",
        "CorrRes": 1
    },
    {
        "TrialN": 24,
        "Target": "4_real_LM.wav",
        "Choice1": "1_posed_LM.wav",
        "Choice2": "2_real_PD.wav",
        "CorrRes": 1
    },
    {
        "TrialN": 25,
        "Target": "sbj4-laugh31-4s.wav",
        "Choice1": "sbj4-laugh32-3s.wav",
        "Choice2": "sbj19-laugh8-2s.wav",
        "CorrRes": 1
    },
    {
        "TrialN": 26,
        "Target": "1_real_AJ.wav",
        "Choice1": "4_posed_AJ.wav",
        "Choice2": "3_real_LM.wav",
        "CorrRes": 1
    },
    {
        "TrialN": 27,
        "Target": "4_posed_BL.wav",
        "Choice1": "1_posed_BL.wav",
        "Choice2": "3_posed_LM.wav",
        "CorrRes": 1
    },
    {
        "TrialN": 28,
        "Target": "1_posed_CM.wav",
        "Choice1": "1_posed_AJ.wav",
        "Choice2": "5_real_CM.wav",
        "CorrRes": 2
    },
    {
        "TrialN": 29,
        "Target": "FS210D14.WAV",
        "Choice1": "FS201S2.WAV",
        "Choice2": "FS210D4.WAV",
        "CorrRes": 2
    },
    {
        "TrialN": 30,
        "Target": "sbj19-laugh2-3s.wav",
        "Choice1": "sbj2-laugh23-4s.wav",
        "Choice2": "sbj19-laugh11-2s.wav",
        "CorrRes": 2
    },
    {
        "TrialN": 31,
        "Target": "2_posed_AJ.wav",
        "Choice1": "5_real_AJ.wav",
        "Choice2": "4_posed_PD.wav",
        "CorrRes": 1
    },
    {
        "TrialN": 32,
        "Target": "FS142D3.WAV",
        "Choice1": "FS232D4.WAV",
        "Choice2": "FS142S6.WAV",
        "CorrRes": 2
    },
    {
        "TrialN": 33,
        "Target": "sbj15-laugh7-2s.wav",
        "Choice1": "sbj15-laugh2-5s.wav",
        "Choice2": "sbj4-laugh26-4s.wav",
        "CorrRes": 1
    },
    {
        "TrialN": 34,
        "Target": "5_posed_BL.wav",
        "Choice1": "1_real_LM.wav",
        "Choice2": "5_real_BL.wav",
        "CorrRes": 2
    },
    {
        "TrialN": 35,
        "Target": "session35participant164-0953_2.wav",
        "Choice1": "session73participant238-R04_3.wav",
        "Choice2": "session35participant164-D01_2.wav",
        "CorrRes": 2
    },
    {
        "TrialN": 36,
        "Target": "sbj4-laugh13-4s.wav",
        "Choice1": "sbj4-laugh28-2s.wav",
        "Choice2": "sbj19-laugh10-4s.wav",
        "CorrRes": 1
    },
    {
        "TrialN": 37,
        "Target": "FS133S1.WAV",
        "Choice1": "FS218S2.WAV",
        "Choice2": "FS133D3.WAV",
        "CorrRes": 2
    },
    {
        "TrialN": 38,
        "Target": "session17participant129-A02_1.wav",
        "Choice1": "session18participant132-0582_2.wav",
        "Choice2": "session17participant129-D25_1.wav",
        "CorrRes": 2
    },
    {
        "TrialN": 39,
        "Target": "sbj4-laugh24-2s.wav",
        "Choice1": "sbj4-laugh46-3s.wav",
        "Choice2": "sbj19-laugh13-3s.wav",
        "CorrRes": 1
    },
    {
        "TrialN": 40,
        "Target": "session108participant290-R05_5.wav",
        "Choice1": "session108participant290-R08_3.wav",
        "Choice2": "session111participant295-A02_4.wav",
        "CorrRes": 1
    },
    {
        "TrialN": 41,
        "Target": "sbj4-laugh39-4s.wav",
        "Choice1": "sbj19-laugh1-2s.wav",
        "Choice2": "sbj4-laugh22-4s.wav",
        "CorrRes": 2
    },
    {
        "TrialN": 42,
        "Target": "5_posed_AJ.wav",
        "Choice1": "2_real_AJ.wav",
        "Choice2": "2_posed_PD.wav",
        "CorrRes": 1
    },
    {
        "TrialN": 43,
        "Target": "sbj11-laugh41-1s.wav",
        "Choice1": "sbj11-laugh29-1s.wav",
        "Choice2": "sbj9-laugh28-1s.wav",
        "CorrRes": 1
    },
    {
        "TrialN": 44,
        "Target": "FS213D1.WAV",
        "Choice1": "FS131S16.WAV",
        "Choice2": "FS213S11.WAV",
        "CorrRes": 2
    },
    {
        "TrialN": 45,
        "Target": "sbj4-laugh7-1s.wav",
        "Choice1": "sbj4-laugh43-4s.wav",
        "Choice2": "sbj3-laugh32-1s.wav",
        "CorrRes": 1
    },
    {
        "TrialN": 46,
        "Target": "2_real_CM.wav",
        "Choice1": "5_posed_LM.wav",
        "Choice2": "5_posed_CM.wav",
        "CorrRes": 2
    },
    {
        "TrialN": 47,
        "Target": "3_posed_CM.wav",
        "Choice1": "4_real_BL.wav",
        "Choice2": "3_real_CM.wav",
        "CorrRes": 2
    },
    {
        "TrialN": 48,
        "Target": "sbj6-laugh12-2s.wav",
        "Choice1": "sbj6-laugh16-1s.wav",
        "Choice2": "sbj9-laugh17-2s.wav",
        "CorrRes": 1
    }
]