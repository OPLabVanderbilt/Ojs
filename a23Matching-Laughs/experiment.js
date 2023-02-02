const keys = ['f', 'g', 'h']

let chainLink = ''
let maxAttentionFails = 10000
let doAttentionChecks = false

let knockedOut = false
let jsPsych = initJsPsych({
    on_finish: function () {
        jsPsych.data.get().localSave('csv', 'testData.csv')
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

function makeTrial(trial) {
    // Add clips in nested timeline
    let trialTimeline = []

    for (let i = 0; i < 3; i++) {
        // Skip third stimulus if not needed
        if (trial['Choice' + (i + 1)] === undefined) {
            continue
        }

        let tmp = {
            type: jsPsychAudioKeyboardResponse,
            prompt: '<b>' + keys[i] + '</b>',
            stimulus: './stimuli/' + trial['Choice' + (i + 1)],
            choices: keys,
            trial_ends_after_audio: true,
            post_trial_gap: 1000,
            on_finish: function (data) {
                // Check if a response was made
                if (data.response === null) {
                    data.Correct = null
                } else {
                    data.Correct = jsPsych.pluginAPI.compareKeys(data.response, keys[trial.CorrRes - 1])
                }
                console.log(data)
            }
        }

        // Continue if previous trial didn't have a response
        if (i > 0) {
            tmp = {
                timeline: [tmp],
                conditional_function: d => !jsPsych.data.get().last(1).values()[0].response
            }
        }

        trialTimeline.push(tmp)
    }

    return [
        {
            type: jsPsychAudioKeyboardResponse,
            prompt: "Target",
            stimulus: './stimuli/' + trial.Target,
            choices: 'NO_KEYS',
            post_trial_gap: 1000,
            trial_ends_after_audio: true
        }, {
            timeline: trialTimeline,
            loop_function: d => !d.values().filter(d => d.response).length,
            data: {
                TestTrial: true,
                SbjID: sbjID,
                TrialN: trial.TrialN,
                Target: trial.Target,
                Choice1: trial.Choice1,
                Choice2: trial.Choice2,
                Choice3: trial.Choice3,
                CorrRes: keys[trial.CorrRes - 1]
            }
        }
    ]
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
    <p>First, you will hear a target person laughing.</p>
    <p>Then, you will hear other audio clips of people laughing.</p>
    <p>You will need to decide which of these test clips is the same person as the person from the target.</p>
    <p>Press any key to continue.</p>
  `,
    post_trial_gap: 500
})

timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
    <p>If the first test clip is the same person as the target, press the <b>${keys[0]}</b> key.</p>
    <p>If the second test clip is the same person as the target, press the <b>${keys[1]}</b> key.</p>
    <p>If you don't make a response, test clips will repeat until you make a response.</p>
    <p><i>Note in this prototype, we have 2 trials that are 2AFC and 2 trials that are 3AFC.</i></p>
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
