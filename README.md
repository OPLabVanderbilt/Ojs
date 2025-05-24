# Tests to measure object recognition ability using jsPsych
The implemented tests do not save any data right now (except for those in /standalone). If you are using online platforms that automatically save data, you may not need to modify the tests, if you are wishing to run the tests locally, you can add code that will save the data to the computer at the end of each experiment.

The stimuli are stored in a zip file in the [Releases](https://github.com/OPLabVanderbilt/Ojs/releases). For each task to run, you must copy the associated stimuli folder to the folder of the task you are running and rename that stimuli folder "stimuli".

For example, "stimuli_newObject" would be copied to the "NewObject" folder containing "experiment.html" and "trials.js". "stimuli_newObject" must then be renamed to "stimuli". If you run the experiment.html file, it should work.

Many of these tests may not function correctly for jsPsych 8.0 and above. Most tests have been checked to be functioning with jsPsych 7.3.

The New Object, Paired Objects, Recognition Memory, and Silhouette Matching tests originate from Smithson, C. J. R., & Gauthier, I. (May 2025). Domain-general object recognition ability has perception and memory subfactors. Abstract of talk given at the Vision Sciences Society 2025 Annual Conference, St. Pete Beach, Florida.

The Many Objects Oddball and 3AFC Matching test originate from "Smithson, C. J. R., Chow, J. K., Chang, T.-Y., & Gauthier, I. (2024). Measuring object recognition ability: Reliability, validity, and the aggregate z-score approach. Behavior Research Methods, 56(7), 6598–6612. https://doi.org/10.3758/s13428-024-02372-w"

The Learning Exemplars test originates from "Richler, J. J., Wilmer, J. B., & Gauthier, I. (2017). General object recognition is specific: Evidence from novel and familiar objects. Cognition, 166, 42–55. https://doi.org/10.1016/j.cognition.2017.05.019"

The Ensemble Transformers test originates from "Sunday, M. A., Tomarken, A., Cho, S.-J., & Gauthier, I. (2022). Novel and familiar object recognition rely on the same ability. Journal of Experimental Psychology: General, 151(3), 676–694. https://doi.org/10.1037/xge0001100"

The auditory o tests folder includes auditory tests that originate from "Chow, J. K., Palmeri, T. J., Pluck, G., & Gauthier, I. (2023). Evidence for an amodal domain-general object recognition ability. Cognition, 238, 105542. https://doi.org/10.1016/j.cognition.2023.105542". These are the same tests used in a follow-up study: "Smithson, C. J. R, Chow, J. K., Tomarken, A., & Gauthier, I. (2025). Visual and auditory object recognition in relation to spatial ability. https://doi.org/10.31219/osf.io/9a2ck_v1"

The 'standalone' folder contains tests used in the paper "Smithson, C. J. R., Chow, J. K., Chang, T.-Y., & Gauthier, I. (2024). Measuring object recognition ability: Reliability, validity, and the aggregate z-score approach. Behavior Research Methods, 56(7), 6598–6612. https://doi.org/10.3758/s13428-024-02372-w" Slightly modified and updated versions of these tests are available in the visual o tests folder, but are not adapted there for offline use (although they can be easily modified to be so).
