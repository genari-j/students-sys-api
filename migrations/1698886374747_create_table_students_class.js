module.exports = {
  up: `
    CREATE TABLE IF NOT EXISTS students_class (
      \`id\` int(11) NOT NULL AUTO_INCREMENT,
      \`code\` varchar(255) NOT NULL,
      \`model\` varchar(255) NOT NULL,
      \`floor\` varchar(255) NOT NULL,
      \`studentsAmount\` varchar(255) NOT NULL,
      \`startDate\` date NOT NULL,
      \`endDate\` date NOT NULL,
      \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
      \`deletedAt\` timestamp NULL DEFAULT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY (\`code\`)
    )
  `,
  down: 'DROP TABLE IF EXISTS students_class'
}