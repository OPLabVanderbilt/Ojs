let chainLink = ''
let maxAttentionFails = 10000
let doAttentionChecks = false
const failLink = ''
const timeoutLink = 'https://andrexia.com/timeout'
const timeoutMin = 1000

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
    sbjID = Date.now()
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
    let numFoils = 0
    for (let i = 0; i < 3; i++) {
        let tmp = {
            type: jsPsychAudioKeyboardResponse,
            prompt: '<b>' + keys[i] + '</b>',
            choices: 'NO_KEYS',
            trial_ends_after_audio: true,
            post_trial_gap: 250
        }

        // Check if it is the target
        if (i + 1 == trial.TargetLoc) {
            tmp.stimulus = "./stimuli/" + trial.Target
        } else {
            numFoils++
            tmp.stimulus = "./stimuli/" + trial['Foil' + numFoils]
        }

        trialTimeline.push(tmp)
    }

    trialTimeline.push({
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
            <p>Which bird was the target?</p>
            <p>Press <b>${keys[0]}</b> for the first bird, <b>${keys[1]}</b> for the second bird, or <b>${keys[2]}</b> for the third bird.</p>
        `,
        choices: keys,
        data: {
            testTrial: true,
            trialN: trial.TrialNum,
            target: trial.Target,
            foil1: trial.Foil1,
            foil2: trial.Foil2,
            corrRes: keys[trial.TargetLoc - 1]
        },
        on_finish: function (data) {
            data.attentionFails = attentionFails
            data.KnockedOut = knockedOut
            data.TimedOut = timedOut

            data.TimeSinceStart = (Date.now() - data.StartTime) / 1000
            data.expTime = data.TimeSinceStart + origTime
            if (data.expTime > 60 * timeoutMin) {
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
        <p>This task will test your memory of bird songs.</p>
        <p>We will start with birdsongs from a single species that you
        will have to remember.</p>
        <p>First, you will be presented with a single bird song, remember
        it closely.</p>
        <p>Press any key to continue.</p>
    `,
    post_trial_gap: 500
});

timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <p>Afterwards, we will test if you can recognize it against two
        other similar bird songs from other species.</p>
        <p>After all three options have been played, pick which clip is the bird song you remembered</p>
        <p>Press <b>f</b> if the first clip is the bird song you remembered</p>
        <p>Press <b>g</b> if the second clip is the bird song you remembered</p>
        <p>Press <b>h</b> if the third clip is the bird song you remembered</p>
        <p><b>These tests are designed to be hard at times. Take your time but if
        you are not sure, take your best guess.</b></p>
        <p>Press any key to continue.</p>
    `,
    post_trial_gap: 500
});

// Define intro trials
let keys = ['f', 'g', 'h']
let speciesN = 0
for (let trial of trials.slice(0, 18)) {
    if ((trial.TrialNum - 1) % 3 == 0) { // Study trial?
        speciesN++
        // Get target bird
        let target = trial.Target
        target = target.replace(' SHORT', '')
        target = target.slice(0, target.indexOf('.') - 1).trim()

        // Learning clip
        timeline.push({
            type: jsPsychAudioKeyboardResponse,
            prompt: 'Bird species ' + speciesN,
            choices: 'NO_KEYS',
            stimulus: "./stimuli/" + target + ' Repeating.mp3',
            trial_ends_after_audio: true,
            post_trial_gap: 250
        })
    }

    for (trial of makeTest(trial)) {
        timeline.push(trial)
    }

    // Add a next trial
    timeline.push({
        type: jsPsychHtmlKeyboardResponse,
        stimulus: 'Response saved. Next trial.',
        trial_duration: 750
    });
}

timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <p>Now, we will review all six target bird species.</p>
        <p>You will be tested on all of them together afterwards.</p>
        <p>Each bird species will be presented once.</p>
        <p>Press any key to continue.</p>
    `,
    post_trial_gap: 500
});

let studyClips = [
    'Acadian Flycatcher Repeating.mp3',
    'American Redstart Repeating.mp3',
    'American Robin Repeating.mp3',
    'Blackpoll Warbler Repeating.mp3',
    'Blackthroated Green Warbler Repeating.mp3',
    'Chipping Sparrow Repeating.mp3'
]

for (let i = 0; i < studyClips.length; i++) {
    timeline.push({
        type: jsPsychAudioKeyboardResponse,
        prompt: 'Bird species ' + (i + 1),
        choices: 'NO_KEYS',
        stimulus: "./stimuli/" + studyClips[i],
        trial_ends_after_audio: true,
        post_trial_gap: 250
    })
}

timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <p>Now, you will be tested on which bird species you remember.</p>
        <p>After all three options have been played, pick which clip is a bird song you remembered</p>
        <p>Press <b>f</b> if the first clip is the bird song you remembered</p>
        <p>Press <b>g</b> if the second clip is the bird song you remembered</p>
        <p>Press <b>h</b> if the third clip is the bird song you remembered</p>
        <p><b>These tests are designed to be hard at times. Take your time but if
        you are not sure, take your best guess.</b></p>
        <p>Press any key to continue.</p>
    `,
    post_trial_gap: 500
})

for (let trial of trials.slice(18)) {
    if (doAttentionChecks && trial.TrialNum == 25) {
        timeline.push({
            type: jsPsychAudioKeyboardResponse,
            stimulus: './stimuli/AttentionCheck1.mp3',
            prompt: '<b>' + keys[0] + '</b>',
            choices: keys,
            trial_ends_after_audio: true,
            post_trial_gap: 250,
            data: { attentionTrial: true }
        })

        timeline.push({
            type: jsPsychAudioKeyboardResponse,
            stimulus: './stimuli/AttentionCheck2.mp3',
            prompt: '<b>' + keys[1] + '</b>',
            choices: keys,
            trial_ends_after_audio: true,
            post_trial_gap: 250,
            conditional_function: d => !jsPsych.data.get().last(1).values()[0].response,
            data: { attentionTrial: true }
        })

        attentionCheck = {
            type: jsPsychAudioKeyboardResponse,
            stimulus: './stimuli/AttentionCheck3.mp3',
            prompt: '<b>' + keys[2] + '</b>',
            choices: keys.concat('m'),
            trial_ends_after_audio: true,
            post_trial_gap: 250,
            conditional_function: d => !jsPsych.data.get().last(1).values()[0].response,
            data: { attentionTrial: true }
        }

        timeline.push({
            timeline: [attentionCheck],
            loop_function: d => !jsPsych.data.get().last(1).values()[0].response,
            on_timeline_finish: function () {
                fail = keys.includes(jsPsych.data.get().last(1).values()[0].response)
                attentionFails += fail ? 1 : 0
                if (attentionFails > maxAttentionFails && source == 'prolific') {
                    // Knock out prolific participants
                    knockedOut = true
                    data.KnockedOut = true
                    data.TimedOut = false
                    jsPsych.endExperiment('The experiment was ended due to missing too many attention checks.')
                }
            }
        })
    }

    for (trial of makeTest(trial)) {
        timeline.push(trial)
    }

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
        <p>One more test until you finish!</p>
        <p>Press any buttton to continue.</p>
    `,
});

// Run
jsPsych.run(timeline);