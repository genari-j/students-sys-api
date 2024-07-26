module.exports = {
  up: `
    CREATE TABLE IF NOT EXISTS colaborators (
      \`id\` int(11) NOT NULL AUTO_INCREMENT,
      \`name\` varchar(255) NOT NULL,
      \`email\` varchar(255) NOT NULL,
      \`cpf\` varchar(255) NOT NULL,
      \`password\` varchar(255) NOT NULL,
      \`active\` tinyint(1) NOT NULL DEFAULT '0',
      \`departmentId\` int(11) NOT NULL,
      \`avatar\` text NULL DEFAULT NULL,
      \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
      \`deletedAt\` timestamp NULL DEFAULT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY (\`email\`),
      UNIQUE KEY (\`cpf\`),
      CONSTRAINT colaborators_fk_1 FOREIGN KEY (\`departmentId\`) REFERENCES colab_departments(\`id\`)
    )
  `,
  down: 'DROP TABLE IF EXISTS colaborators'
}