module.exports = {
  up: `
    CREATE TABLE IF NOT EXISTS students_matters (
      \`id\` int(11) NOT NULL AUTO_INCREMENT,
      \`name\` varchar(255) NOT NULL,
      \`active\` tinyint(1) NOT NULL DEFAULT '0',
      \`teacherId\` int(11) NOT NULL,
      \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
      \`deletedAt\` timestamp NULL DEFAULT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY (\`name\`),
      CONSTRAINT students_matters_fk_1 FOREIGN KEY (\`teacherId\`) REFERENCES students_teachers(\`id\`)
    )
  `,
  down: 'DROP TABLE IF EXISTS students_matters'
}