const programDatamodel = require('../Models/programDatas') // Importing the program data model from the Models folder.

exports.addProgram = async (req, res) => {
    // Destructuring the program details from the request body.
    const { programName, programType, numberofClasses, numberofStudents, numberofSections, numberofVenues } = req.body

    try {
        // Validating if required fields are empty.
        if (programName.trim() == '' || programType.trim() == '' || numberofClasses == '' || numberofStudents == '' || numberofSections == '') {
            return res.status(400).json({ success: false, message: 'All fields are mandatory' })
            // Checking if "on" and "off" stages are properly filled in the numberofVenues array.
        } else if (numberofVenues[0].on == '' || numberofVenues[0].off == '') {
            return res.status(400).json({ success: false, message: 'Please fill on and off stages correctly' })
            // Validating if the program name has more than 2 characters.
        } else if (programName.length <= 2) {
            return res.status(400).json({ success: false, message: 'Program name should contain at least 3 characters' })
            // Validating if the program type has more than 2 characters.
        } else if (programType.length <= 2) {
            return res.status(400).json({ success: false, message: 'Program type should contain at least 3 characters' })
        } else {
            // Converting string input values to numbers for further validation.
            const numClasses = Number(numberofClasses);
            const numStudents = Number(numberofStudents);
            const numSections = Number(numberofSections);

            // Checking if the provided values for classes, students, and sections are valid numbers.
            if (isNaN(numClasses) || isNaN(numStudents) || isNaN(numSections)) {
                return res.status(400).json({ success: false, message: 'Number of classes, students, sections, and venues must be valid numbers' })
            } else {
                // Creating a new schema (document) for the program.
                const newShema = new programDatamodel({
                    programName,
                    programType,
                    numberofClasses,
                    numberofStudents,
                    numberofSections,
                    numberofVenues
                })

                // Saving the program details to the database.
                await newShema.save()

                // Sending success response after successful program registration.
                return res.status(200).json({ success: true, message: 'Program registration successful' })
            }
        }
    } catch (err) {
        // Catching any internal server errors and sending a 500 status response.
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}



exports.addController = async (req, res) => {
    // Destructure controllerName and programName from the request body
    const { controllerName, programName } = req.body

    try {
        // Check if either controllerName or programName is empty
        if (controllerName.trim() == '' || programName.trim() == '') {
            // Return 400 status code with an error message if any field is empty
            return res.status(400).json({ success: false, message: 'All fields are mandatory' })

        // Check if programName is less than 3 characters
        } else if (programName.length < 3) {
            // Return 400 status code with an error message if programName is too short
            return res.status(400).json({ success: false, message: 'Program name should contain 3 letters minimum' })

        // Check if controllerName is less than 3 characters
        } else if (controllerName.length < 3) {
            // Return 400 status code with an error message if controllerName is too short
            return res.status(400).json({ success: false, message: 'Controller name should contain 3 letters minimum' })

        } else {
            // Proceed if the input validation passes
            try {
                // Find the program document by programName in the database
                const program = await programDatamodel.findOne({ programName: programName })

                // If no program is found, return 400 status code with an error message
                if (!program) {
                    return res.status(400).json({ success: false, message: 'Program not found' })

                } else {
                    // Add controllerName to the program's controllers array without duplicates using addToSet
                    const adding = await program.controllers.addToSet(controllerName);
                    // Save the updated program document to the database
                    await program.save();

                    // Return 200 status code with success message
                    return res.status(200).json({ success: true, message: 'Controller added successfully' })
                }

            } catch (err) {
                 // Catching any internal server errors and sending a 500 status response.
                 return res.status(500).json({ success: false, message: 'Internal server error' });
            }
        }

    } catch (err) {
         // Catching any internal server errors and sending a 500 status response.
         return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

