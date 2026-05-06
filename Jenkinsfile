pipeline {
    agent any

    triggers {
        cron('30 21 * * *')   // ✅ Runs daily at 9:30 PM
    }

    tools {
        nodejs 'NodeJS'
    }

    environment {
        ANDROID_HOME = "C:\\Users\\gwl\\AppData\\Local\\Android\\Sdk"
        PATH = "${ANDROID_HOME}\\platform-tools;${ANDROID_HOME}\\emulator;${env.PATH}"
        AVD_NAME = "Pixel_7"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/gauravpgwl007-maker/Trashscan_Automation.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat '''
                echo Cleaning npm cache...
                npm cache clean --force

                echo Removing node_modules...
                rmdir /s /q node_modules

                echo Deleting package-lock.json...
                del package-lock.json

                echo Installing dependencies...
                npm install --legacy-peer-deps
                '''
            }
        }

        stage('Start Emulator') {
            steps {
                bat '''
                echo Starting emulator...
                start "" "%ANDROID_HOME%\\emulator\\emulator.exe" -avd %AVD_NAME% -no-snapshot -no-audio -no-boot-anim

                echo Waiting after emulator start...
                ping 127.0.0.1 -n 10 > nul
                '''
            }
        }

        stage('Wait for Emulator Boot') {
            steps {
                bat '''
                adb wait-for-device

                :loop
                adb shell getprop sys.boot_completed | find "1"
                if errorlevel 1 (
                    echo Waiting for emulator to boot...
                    ping 127.0.0.1 -n 5 > nul
                    goto loop
                )

                echo Emulator boot completed!
                '''
            }
        }

        stage('Start Appium') {
    steps {
        bat '''
        echo Starting Appium server...
        start "" cmd /c appium -p 4723 --allow-insecure=adb_shell

        echo Waiting for Appium to be ready...
        ping 127.0.0.1 -n 10 > nul
        '''
    }
}

        stage('Grant Permissions') {
            steps {
                bat '''
                echo Granting app permissions...

                adb shell pm grant com.gwl.trashscan android.permission.CAMERA
                adb shell pm grant com.gwl.trashscan android.permission.READ_MEDIA_IMAGES
                adb shell pm grant com.gwl.trashscan android.permission.READ_EXTERNAL_STORAGE
                '''
            }
        }

        stage('Run Tests') {
            steps {
                bat '''
                echo Running automation tests...
                npx wdio run wdio.conf.js
                '''
            }
        }

        stage('Generate Allure Report') {
            steps {
                bat '''
                if exist allure-results (
                    echo Generating Allure report...
                    allure generate allure-results --clean -o allure-report
                ) else (
                    echo No allure-results found!
                )
                '''
            }
        }
    }

    post {
        always {
            allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
        }

        cleanup {
            bat '''
            echo Cleaning up emulator...

            adb devices

            for /f "tokens=1" %%i in ('adb devices ^| find "emulator"') do (
                echo Killing %%i
                adb -s %%i emu kill
            )

            echo Cleanup done
            '''
        }
    }
}