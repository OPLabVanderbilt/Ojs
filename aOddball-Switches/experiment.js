let chainLink = '' // Change this to link to another experiment/site at finish
let maxAttentionFails = 1000
let doAttentionChecks = true
const failLink = ''
const timeoutLink = 'https://andrexia.com/timeout'
const timeoutMin = 1
let keys = ['f', 'g', 'h']

let knockedOut = false
let timedOut = false
var jsPsych = initJsPsych({
    on_finish: function () {
        if (!chainLink == '' && !knockedOut && !timedOut) {
            window.location = chainLink + "?id=" + sbjID + "&attn=" + attentionFails + "&src=" + source + '&study=' + study + '&time=' + Math.round(expTime)
        } else if (!failLink == '' && knockedOut) {
            window.location = failLink
        } else if (!timeoutLink == '' && timedOut) {
            window.location = timeoutLink
        }
    }
});

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

function makeTest(trial) {
    // Add clips in nested timeline
    let trialTimeline = []
    for (let i = 0; i < 3; i++) {
        trialTimeline.push({
            type: jsPsychAudioKeyboardResponse,
            prompt: '<b>' + keys[i] + '</b>',
            stimulus: "./stimuli/" + trial['Stim' + (i + 1)],
            choices: 'NO_KEYS',
            trial_ends_after_audio: true,
            post_trial_gap: 0
        })

        trialTimeline.push({
            type: jsPsychAudioKeyboardResponse,
            prompt: '--',
            stimulus: "./stimuli/NoiseMask.mp3",
            choices: 'NO_KEYS',
            trial_ends_after_audio: true,
            post_trial_gap: 250
        })


    }

    // Add response
    trialTimeline.push({
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
            <p>Which audio clip was from a different button?</p>
            <p><b>${keys[0]}</b>-<b>${keys[1]}</b>-<b>${keys[2]}</b></p>
        `,
        choices: keys,
        post_trial_gap: 250,
        data: {
            TestTrial: true,
            TrialN: trial.TrialN,
            Stim1: trial.Stim1,
            Stim2: trial.Stim2,
            Stim3: trial.Stim3,
            CorrRes: keys[trial.CorrRes - 1],
            Oddball: trial.Oddball,
            Pair: trial.Pair,
        },
        on_finish: function (data) {
            data.Corr = jsPsych.pluginAPI.compareKeys(data.response, data.CorrRes)
            data.attentionFails = attentionFails
            data.KnockedOut = knockedOut
            data.TimedOut = timedOut

            data.TimeSinceStart = (Date.now() - data.StartTime) / 1000
            data.ExpTime = data.TimeSinceStart + data.OrigTime
            expTime = data.ExpTime
            if (data.ExpTime > 60 * timeoutMin) {
                timedOut = true
                jsPsych.endExperiment('The experiment was ended due to taking too long.')
            }
        }
    })

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
});

// Instructions
timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <p>This task will test your ability to compare the sounds that computer buttons (on keyboards) make.</p>
        <p>Three audio clips of buttons being pressed will play one after another with a distractor after each clip.</p>
        <p>Two audio clips will be from the same button and one will be from a 
            different button.</p>
        <p>You need to figure out which audio clip is the one from the different
            button.</p>
        <p>The cadence of the button clicks may change but does not matter.</p>
        <p>The timbre, pitch, and clicking noises are relevant to differentiate
        buttons.</p>
        <p>Press any key to continue.</p>
    `,
    post_trial_gap: 500
});

timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <p>Respond using the key (<b>${keys[0]}</b>, <b>${keys[1]}</b>, or <b>${keys[2]}</b>) for the button that is DIFFERENT.</p>
        <p><b>These tests are designed to be hard at times. Take your time but if
        you are not sure, take your best guess.</b></p>
        <p>Press any key to continue.</p>
    `,
    post_trial_gap: 500
});

timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <p>We will start with a practice trial.</p>
        <p>Press any key to start.</p>
    `,
    post_trial_gap: 500
});

// Practice trial
const pracTrial = {
    "TrialN": -1,
    "Stim1": "Aliaz100g1.mp3",
    "Stim2": "Aliaz100g3.mp3",
    "Stim3": "CherryBrown1.mp3",
    "CorrRes": 3,
    "Pair": "AliazG100g",
    "Oddball": "CherryBrown",
}
let pracTimeline = makeTest(pracTrial)
pracTimeline[pracTimeline.length - 1].TestTrial = false

pracTimeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
        let lastTrial = jsPsych.data.get().last(1).values()[0]
        if (lastTrial.Corr) {
            return 'Correct!'
        } else {
            return 'Incorrect! Try again!'
        }
    },
    trial_duration: 750
})
timeline.push({
    timeline: pracTimeline,
    loop_function: function (data) {
        let lastTrial = jsPsych.data.get().last(2).values()[0]
        return !lastTrial.Corr
    }
})

// Instructions again
timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <p>Good job! You are ready to start the test.</p>
        <p>Respond using the key (<b>${keys[0]}</b> <b>${keys[1]}</b> or <b>${keys[2]}</b>) for the button that is DIFFERENT.</p>
        <p><b>These tests are designed to be hard at times. Take your time but if
        you are not sure, take your best guess.</b></p>
        <p>Press any key to continue.</p>
    `,
    post_trial_gap: 500
});

// Define trials
for (let trial of trials) {
    if (doAttentionChecks && trial.TrialN == 30) {
        let attnTrial = makeTest({
            "TrialN": -1,
            "Stim1": "Example2.mp3",
            "Stim2": "Attention.mp3",
            "Stim3": "Example2.mp3",
            "CorrRes": 3,
            "Pair": "AttentionCheck",
            "Oddball": "AttentionCheck",
        })

        // Modify attention check
        attnTrial[attnTrial.length - 1].stimulus = `
            <p>This is an attention check. Press the p key.</p>
            <p><b>${keys[0]}</b>-<b>${keys[1]}</b>-<b>${keys[2]}</b></p>
        `
        attnTrial[attnTrial.length - 1].choices = keys.concat('p')
        attnTrial[attnTrial.length - 1].data.TestTrial = false
        attnTrial[attnTrial.length - 1].data.AttentionTrial = true
        attnTrial[attnTrial.length - 1].on_finish = function (data) {
            fail = keys.includes(jsPsych.data.get().last(1).values()[0].response)
            attentionFails += fail ? 1 : 0
            data.success = !fail
            data.attentionFails = attentionFails
            if (attentionFails > maxAttentionFails && source == 'prolific') {
                // Knock out prolific participants
                knockedOut = true
                data.KnockedOut = true
                data.timedOut = false
                jsPsych.endExperiment('The experiment was ended due to missing too many attention checks.')
            }
        }
        attnTrial.forEach(bit => { timeline.push(bit) })
    }

    let trialBits = makeTest(trial)
    trialBits.forEach(bit => { timeline.push(bit) })

    // Add a next trial
    timeline.push({
        type: jsPsychHtmlKeyboardResponse,
        stimulus: 'Response saved. Next trial.',
        trial_duration: 750
    });
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