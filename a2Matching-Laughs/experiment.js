const keys = ['f', 'j']

let chainLink = ''
let maxAttentionFails = 10000
let doAttentionChecks = true
const failLink = 'https://andrexia.com/fail'
const timeoutLink = 'https://andrexia.com/timeout'
const timeoutMin = 10000

let knockedOut = false
let timedOut = false
let jsPsych = initJsPsych({
    on_finish: function () {
        if (!chainLink == '' && !knockedOut && !timedOut) {
            window.location = chainLink + "?id=" + sbjID + "&attn=" + attentionFails + "&src=" + source + '&study=' + study + '&time=' + Math.round(expTime)
        } else if (!failLink == '' && knockedOut) {
            window.location = failLink
        } else if (!timeoutLink == '' && timedOut) {
            window.location = timeoutLink
        }
    }
})

let study = jsPsych.data.getURLVariable('study')
if (study === undefined) {
    study = 'unknown'
}

// Make id
let sbjID = jsPsych.data.getURLVariable('id');
if (sbjID === undefined) {
    sbjID = jsPsych.randomization.randomID(10)
}

// Get attention check counter
let attentionFails = Number(jsPsych.data.getURLVariable('attn'))
if (isNaN(attentionFails)) {
    attentionFails = 0
}

// Get source of participant
let source = jsPsych.data.getURLVariable('src')
if (source === undefined) {
    source = 'unknown'
}

// Get time since start
let origTime = Number(jsPsych.data.getURLVariable('time'))
if (isNaN(origTime)) {
    origTime = 0
}
let expTime = origTime

jsPsych.data.addProperties({
    SbjID: sbjID,
    Study: study,
    Source: source,
    OrigTime: origTime,
    StartTime: Date.now()
})

function makeTrial(trial, feedback = false) {
    // Add trials to nested timeline
    let trialTimeline = []

    // Present target
    trialTimeline.push({
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
        <p>Press space to hear the target person laugh.</p>
        <p>Listen carefully, it may be fast!</p>
        `,
        choices: [' '],
        post_trial_gap: 500
    })

    // Present target
    trialTimeline.push({
        type: jsPsychAudioKeyboardResponse,
        prompt: "Target",
        stimulus: './stimuli/' + trial.Target,
        trial_ends_after_audio: true,
        choices: 'NO_KEYS'
    })

    // Present test stimuli 1
    trialTimeline.push({
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
            <p>Option 1 (${keys[0]}) ------------------ Option 2 (${keys[1]})</p>
            <p>Press space to hear the option 1.</p>
            <p>Listen carefully, it may be fast!</p>
        `,
        choices: [' ']
    })

    trialTimeline.push({
        type: jsPsychAudioKeyboardResponse,
        prompt: `<p><b>Option 1 (${keys[0]})</b> ------------------ Option 2 (${keys[1]})</p>`,
        stimulus: './stimuli/' + trial['Choice1'],
        choices: 'NO_KEYS',
        trial_ends_after_audio: true
    })

    // Present test stimuli 2
    trialTimeline.push({
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
            <p>Option 1 (${keys[0]}) ------------------ Option 2 (${keys[1]})</p>
            <p>Press space to hear the option 2.</p>
            <p>Listen carefully, it may be fast!</p>
        `,
        choices: [' ']
    })

    trialTimeline.push({
        type: jsPsychAudioKeyboardResponse,
        prompt: `<p>Option 1 (${keys[0]}) ------------------ <b>Option 2 (${keys[1]})</b></p>`,
        stimulus: './stimuli/' + trial['Choice2'],
        choices: 'NO_KEYS',
        trial_ends_after_audio: true
    })

    // Present response window
    trialTimeline.push({
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
            <p>Option 1 (${keys[0]}) ------------------ Option 2 (${keys[1]})</p>
            <p>Which option is the same person as the target?</p>
        `,
        choices: keys,
        post_trial_gap: 250,
        data: {
            TestTrial: true,
            TrialN: trial.TrialN,
            Target: trial.Target,
            Choice1: trial.Choice1,
            Choice2: trial.Choice2,
            CorrRes: keys[trial.CorrRes - 1],
            Diff: trial.MeanPerf,
            Cor: trial.Cor

        },
        on_finish: function (data) {
            data.Correct = jsPsych.pluginAPI.compareKeys(data.response, keys[trial.CorrRes - 1])
            data.attentionFails = attentionFails

            data.KnockedOut = knockedOut
            data.TimedOut = timedOut

            data.TimeSinceStart = (Date.now() - data.StartTime) / 1000
            data.ExpTime = data.TimeSinceStart + data.OrigTime
            expTime = data.ExpTime
            if (data.ExpTime > 60 * timeoutMin) {
                timedOut = true
                data.TimedOut = true
                jsPsych.endExperiment('The experiment was ended due to taking too long.')
            }
        }
    })

    // Add feedback if needed
    if (feedback) {
        trialTimeline.push({
            type: jsPsychHtmlKeyboardResponse,
            stimulus: function () {
                let lastTrial = jsPsych.data.get().last(1).values()[0]
                if (lastTrial.Correct) {
                    return `
                        <p">Correct!</p>
                    `
                } else {
                    return `
                        <p">Incorrect!</p>
                    `
                }
            },
            choices: 'NO_KEYS',
            trial_duration: 1500,
        })
    }

    return trialTimeline
}

// Timeline
var timeline = [];

timeline.push({
    type: jsPsychBrowserCheck,
    inclusion_function: (data) => {
        return !data.mobile
    },
    exclusion_message: (data) => {
        return `
    <p>You must use a desktop/laptop computer to participate in this
    experiment.</p>
    <p>Please restart the experiment on a desktop/laptop computer.</p>
  `;
    }
})

// Enter full screen
timeline.push({
    type: jsPsychFullscreen,
    fullscreen_mode: true
})

// Preload
timeline.push({
    type: jsPsychPreload,
    auto_preload: true
});

// Starting gesture for Audio
timeline.push({
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <p>In this test, you will be listening to audio clips.</p>
  `,
    choices: ['Begin'],
    post_trial_gap: 500
});

// Audio check trial
let audioCheck = {
    type: jsPsychAudioKeyboardResponse,
    prompt: 'Please adjust your audio volume, it should be quiet but audible. Follow the spoken instructions.',
    stimulus: './stimuli/SoundCheck.mp3',
    choices: '5',
    trial_ends_after_audio: true,
    post_trial_gap: 250
};

timeline.push({
    timeline: [audioCheck],
    loop_function: d => !jsPsych.pluginAPI.compareKeys(d.values()[0].response, '5')
})

// Instructions
timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
    <p>This task will test your ability to recognize people from their laugh.</p>
    <p>First, you will hear the target person laughing.</p>
    <p>Then, you will hear other test audio clips of people laughing.</p>
    <p>Afterwards, you will need to decide which of these test clips is the same person as the target person.</p>
    <p>Press any key to continue.</p>
  `,
    post_trial_gap: 500
})

timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
    <p>If the first test clip is the same person as the target, press the <b>${keys[0]}</b> key.</p>
    <p>If the second test clip is the same person as the target, press the <b>${keys[1]}</b> key.</p>
    <p>Take your time as these trials are designed to be hard sometimes. If you're not sure, just make your best guess.</p>
    <p>Some laughs may be genuine, others may be posed, this doesn't matter, focus on the person laughing.</p>
    <p>Press any key to continue.</p>
  `,
    post_trial_gap: 500
})

for (trial of trials) {
    if (doAttentionChecks && trial.TrialN == 5) {
        let attnTrial = makeTrial({
            "Target": "Attention1.wav",
            "Choice1": "Attention2.wav",
            "Choice2": "Attention3.wav",
            "CorrRes": 1,
            "DiffScore": -10000000,
            "source": "AttentionCheck",
            "TrialN": -1
        })

        // Modify attention check
        attnTrial[attnTrial.length - 1].stimulus = `
            <p>Option 1 (${keys[0]}) ------------------ Option 2 (${keys[1]})</p>
            <p>Press the b key.</p>
        `
        attnTrial[attnTrial.length - 1].choices = keys.concat('b')
        attnTrial[attnTrial.length - 1].data.TestTrial = false
        attnTrial[attnTrial.length - 1].data.AttentionTrial = true
        attnTrial[attnTrial.length - 1].on_finish = function (data) {
            fail = keys.includes(jsPsych.data.get().last(1).values()[0].response)
            attentionFails += fail ? 1 : 0
            data.success = !fail
            data.attentionFails = attentionFails
            data.KnockedOut = knockedOut
            data.TimedOut = timedOut
            if (attentionFails > maxAttentionFails && source == 'prolific') {
                // Knock out prolific participants
                knockedOut = true
                data.KnockedOut = true
                data.TimedOut = false
                jsPsych.endExperiment('The experiment was ended due to missing too many attention checks.')
            }
        }
        attnTrial.forEach(bit => { timeline.push(bit) })
    }

    trialSlides = makeTrial(trial)
    timeline.push(...trialSlides)
}

// Exit fullscreen
timeline.push({
    type: jsPsychFullscreen,
    fullscreen_mode: false
})

// End card
timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <p>You have finished this test, good job!</p>
        <p>Press any buttton to continue.</p>
    `,
});

// Run
jsPsych.run(timeline);
