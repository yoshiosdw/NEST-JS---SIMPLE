import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLocationTablesInteger1761123746538 implements MigrationInterface {
    name = 'CreateLocationTablesInteger1761123746538'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "location_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a8e0edf03ea5715ed995151d637" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "locations" ("id" SERIAL NOT NULL, "main_warehouse" character varying NOT NULL, "code" character varying NOT NULL, "name" character varying NOT NULL, "additional_info" character varying, "nsleft" integer NOT NULL DEFAULT '1', "nsright" integer NOT NULL DEFAULT '2', "treeParentId" integer, "created_at" TIMESTAMP NOT NULL DEFAULT NOW(), "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(), "nsleft" integer NOT NULL DEFAULT '1', "nsright" integer NOT NULL DEFAULT '2', "locationTypeId" uuid, "parentId" integer, CONSTRAINT "PK_7cc1c9e3853b94816c094825e74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "locations" ADD CONSTRAINT "FK_f4fd5a3b298dbcb9e111f4eb310" FOREIGN KEY ("locationTypeId") REFERENCES "location_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "locations" ADD CONSTRAINT "FK_9f238930bae84c7eafad3785d7b" FOREIGN KEY ("parentId") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "locations" DROP CONSTRAINT "FK_9f238930bae84c7eafad3785d7b"`);
        await queryRunner.query(`ALTER TABLE "locations" DROP CONSTRAINT "FK_f4fd5a3b298dbcb9e111f4eb310"`);
        await queryRunner.query(`DROP TABLE "locations"`);
        await queryRunner.query(`DROP TABLE "location_types"`);
    }

}
