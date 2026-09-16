pipeline {
    agent any

    tools {
        nodejs 'node20'
    }

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Build #${BUILD_NUMBER} - Branch: ${env.BRANCH_NAME ?: 'N/A'}"
                sh 'ls -la'
            }
        }

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

    }

    post {
        always {
            cleanWs()
        }
        success {
            echo "✅ Build #${BUILD_NUMBER} OK"
        }
        failure {
            echo "❌ Build #${BUILD_NUMBER} FALLÓ"
        }
    }
}