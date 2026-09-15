pipeline {
    agent any

    tools {
        nodejs 'node20' // Configurar esta tool en Jenkins > Global Tool Configuration
    }

    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t twitchspamdetector/ingestor:${BUILD_NUMBER} .'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
