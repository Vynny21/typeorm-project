/* eslint-disable no-unused-vars */
import { MigrationInterface, QueryRunner, getRepository } from 'typeorm'
import { User } from '../entity/User'

export class CreateAdminUser1591854056116 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    const user = new User()
    user.username = 'admin'
    user.password = 'admin'
    user.hashPassword()
    user.role = 'ADMIN'
    const userRepository = getRepository(User)
    await userRepository.save(user)
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('CreateAdminUser')
  }
}