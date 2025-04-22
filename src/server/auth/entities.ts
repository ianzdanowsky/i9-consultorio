  import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    type ValueTransformer,
    OneToOne,
  } from "typeorm"
  
  const transformer: Record<"date" | "bigint", ValueTransformer> = {
    date: {
      from: (date: string | null) => date && new Date(parseInt(date, 10)),
      to: (date?: Date) => date?.valueOf().toString(),
    },
    bigint: {
      from: (bigInt: string | null) => bigInt && parseInt(bigInt, 10),
      to: (bigInt?: number) => bigInt?.toString(),
    },
  }
  
  @Entity({ name: "cusuario" })
  export class UserEntity {
  
    @PrimaryGeneratedColumn()
    id!: number; 

    @Column({ type: "varchar" })
    nivel!: string

    @Column({ type: "varchar" })
    nomecompleto!: string

    @Column({ type: "varchar" })
    email!: string
  
    @OneToMany(() => SessionEntity, (session) => session.userId)
    sessions!: SessionEntity[]
  
    // Stores the user's password and other sensitive information
    @OneToOne(() => AccountEntity, (account) => account.usuarioId)
    accounts!: AccountEntity[]
    
    @OneToMany(() => UserProfissionalEntity, (userProfissional) => userProfissional.usuarioid)
    userProfissional!: UserProfissionalEntity[]
  }
  
  @Entity({ name: "usuarioSenha" })
  export class AccountEntity {
    @PrimaryGeneratedColumn()
    id!: number
  
    @Column()
    usuarioId!: number

    @Column({ type: "varchar", nullable: true })
    senha!: string | null

    @Column()
    data!: string
  
    @OneToOne(() => UserEntity, (user) => user.accounts, {
      createForeignKeyConstraints: true,
    })
    user!: UserEntity
  }
  

  @Entity({ name: "mprofissionalusuario" })
  export class UserProfissionalEntity {
    @PrimaryGeneratedColumn()
    id!: number
  
    @Column({ type: "varchar" })
    usuarioid!: string
  
    @Column({ type: "varchar" })
    profissionalid!: string
  
    @ManyToOne(() => UserEntity, (user) => user.id)
    user!: UserEntity
  }

  @Entity({ name: "sessions" })
  export class SessionEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string
  
    @Column({ unique: true })
    sessionToken!: string
  
    @Column({ type: "uuid" })
    userId!: string
  
    @Column({ transformer: transformer.date })
    expires!: string
  
    @ManyToOne(() => UserEntity, (user) => user.sessions)
    user!: UserEntity
  }
  
  @Entity({ name: "verification_tokens" })
  export class VerificationTokenEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string
  
    @Column()
    token!: string
  
    @Column()
    identifier!: string
  
    @Column({ transformer: transformer.date })
    expires!: string
  }