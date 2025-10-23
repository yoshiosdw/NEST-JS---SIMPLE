import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Tree, TreeChildren, TreeParent } from 'typeorm';
import { LocationType } from './locationType/location-type.entity';

@Entity('locations')
@Tree('nested-set')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  main_warehouse: string;

  @Column()
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  additional_info?: string;

  @ManyToOne(() => LocationType)
  locationType: LocationType;

  @TreeParent()
  parent?: Location;

  @TreeChildren()
  children?: Location[];

  // @Column({ type: 'int', name: 'nsleft', nullable: true })
  // left: number;

  // @Column({ type: 'int', name: 'nsright', nullable: true })
  // right: number;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  updated_at: Date;
}
