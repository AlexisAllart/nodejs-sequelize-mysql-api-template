module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'First name is required'
                },
                notEmpty: {
                    msg: 'First name is required'
                }
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Last name is required'
                },
                notEmpty: {
                    msg: 'Last name is required'
                }
            }
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notNull: {
                    msg: 'Username is required'
                },
                notEmpty: {
                    msg: 'Username is required'
                },
                isUnique: (value, next) => {
                    User.findOne({
                        where: {
                            userName: value
                        }
                    }).then(user => {
                        if(user) {
                            return next('Username already in use');
                        }
                        return next();
                    }).catch(err => {
                        return next(err);
                    });
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notNull: {
                    msg: 'Email is required'
                },
                notEmpty: {
                    msg: 'Email is required'
                },
                isEmail: {
                    msg: 'Email is invalid'
                },
                isUnique: (value, next) => {
                    User.findOne({
                        where: {
                            email: value
                        }
                    }).then(user => {
                        if(user) {
                            return next('Email address already in use');
                        }
                        return next();
                    }).catch(err => {
                        return next(err);
                    });
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Password is required'
                },
                notEmpty: {
                    msg: 'Password is required'
                }
            }
        },
        description: {
            type: DataTypes.STRING
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Role is required'
                },
                notEmpty: {
                    msg: 'Role is required'
                }
            } 
        },
        status: {
            type: DataTypes.STRING
        },
        picture: {
            type: DataTypes.STRING
        },
        lastLogin: {
            type: DataTypes.DATE
        },
        lastLogout: {
            type: DataTypes.DATE
        }
    }, {});
    User.associate = function(models) {
        // associations can be defined here
    }
    return User;
};