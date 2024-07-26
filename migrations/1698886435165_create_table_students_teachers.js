module.exports = {
  up: `
    CREATE TABLE IF NOT EXISTS students_teachers (
      \`id\` int(11) NOT NULL AUTO_INCREMENT,
      \`name\` varchar(255) NOT NULL,
      \`email\` varchar(255) NOT NULL,
      \`cpf\` varchar(255) NOT NULL,
      \`genre\` varchar(255) NOT NULL,
      \`birth\` date NOT NULL,
      \`classId\` int(11) NOT NULL,
      \`avatar\` text NULL DEFAULT NULL,
      \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
      \`deletedAt\` timestamp NULL DEFAULT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY (\`email\`),
      UNIQUE KEY (\`cpf\`),
      CONSTRAINT students_teachers_fk_1 FOREIGN KEY (\`classId\`) REFERENCES students_class(\`id\`)
    )
  `,
  down: 'DROP TABLE IF EXISTS students_teachers'
}