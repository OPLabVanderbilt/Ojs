const keys = ['f', 'g']

let chainLink = ''
let maxAttentionFails = 10000
let doAttentionChecks = false

let knockedOut = false
let jsPsych = initJsPsych({
    on_finish: function () {
        if (!chainLink == '' && !knockedOut) {
            window.location = chainLink + "?id=" + sbjID + "&attn=" + attentionFails + "&src=" + source + '&study=' + study
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
        choices: 'NO_KEYS',
        post_trial_gap: 250,
    })

    // Present test stimuli
    for (let i = 0; i < 2; i++) {
        trialTimeline.push({
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `
                <p>Press space to hear the option ${i + 1}.</p>
                <p>Listen carefully, it may be fast!</p>
            `,
            choices: [' '],
            post_trial_gap: 500
        })

        trialTimeline.push({
            type: jsPsychAudioKeyboardResponse,
            prompt: "Option " + (i + 1),
            stimulus: './stimuli/' + trial['Choice' + (i + 1)],
            choices: 'NO_KEYS',
            trial_ends_after_audio: true,
            post_trial_gap: 250,
        })
    }

    // Present response window
    trialTimeline.push({
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
            <p>If option 1 is the target person laughing, press ${keys[0]}.</p>
            <p>If option 2 is the target person laughing, press ${keys[1]}.</p>
        `,
        choices: keys,
        post_trial_gap: 250,
        data: {
            TestTrial: true,
            SbjID: sbjID,
            TrialN: trial.TrialN,
            Target: trial.Target,
            Choice1: trial.Choice1,
            Choice2: trial.Choice2,
            CorrRes: keys[trial.CorrRes - 1],
        },
        on_finish: function (data) {
            data.Correct = jsPsych.pluginAPI.compareKeys(data.response, keys[trial.CorrRes - 1])
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
// timeline.push({
//     type: jsPsychFullscreen,
//     fullscreen_mode: true
// })

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
    prompt: 'Please adjust your audio volume and follow the spoken instructions.',
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
    <p>Press any key to continue.</p>
  `,
    post_trial_gap: 500
})

for (trial of trials) {
    trialSlides = makeTrial(trial)
    timeline.push(...trialSlides)
}

// Run
jsPsych.run(timeline);
