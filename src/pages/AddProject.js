import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, ImageBackground} from "react-native";
import {Actions} from 'react-native-router-flux';
import {Input, Button, ListItem, Divider} from 'react-native-elements';
import {colors, fonts} from "res/index";
import Icon from 'react-native-vector-icons/FontAwesome';
import {inject, observer} from "mobx-react";
import SelectMultiple from '@quanterdynamic/react-native-multiple-select'
const renderLabel = (item) => {
    return (
        <View style={{marginLeft: 15,borderRadius:25}}>
            <Text style={[{marginLeft: 0,fontFamily:fonts.avenirMedium,fontSize:17}]}>{item.name}</Text>
            <Text style={[{marginLeft: 0,fontFamily:fonts.avenirMedium,color:colors.black50}]}>{item.mastery}</Text>
        </View>
    )
};

@inject('authStore')
@observer
class AddProject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            people: [],
            selectedPeople: [],
        };
    }
    state = {
        projectName: '',
        dueDate: '',
    };
    componentDidMount() {
        const {authStore} = this.props;
        this.setState({
            people: authStore.user.workers
        })
    }

    onSelectionsChange = (selectedPeople) => {
        this.setState({selectedPeople})
    };

    saveProject = async () => {
        const {authStore} = this.props;
        const {selectedPeople, projectName, dueDate} = this.state;
        if(projectName && dueDate) {
            authStore.setProjectDatabase(projectName, dueDate,selectedPeople);
            await authStore.loadProjectDatabase();
            Actions.manage();
        }
    };
    keyExtractor = (items, index) => index.toString();
    render() {
        const {authStore} = this.props;

        return (
            <View style={styles.container}>
                <StatusBar hidden={true}/>
                <View style={styles.topButtons}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={Actions.pop}
                    >
                        <Icon name={'reply-all'}
                              size={25}
                              color={colors.white}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveButton}
                                      onPress={this.saveProject}>
                        <Icon
                            name={'save'}
                            size={25}
                            color={colors.white}
                        />
                        <Text style={styles.saveButtonText}>
                            Save Project
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.inputsDirection}>
                    <Input
                        placeholder={'Project Name'}
                        inputStyle={styles.inputTextStyle}
                        containerStyle={styles.inputContainer}
                        onChangeText={(projectName) => this.setState({projectName: projectName})}
                        leftIcon={
                            <Icon
                                name="file-text-o"
                                size={30}
                                color={colors.black50}
                            />
                        }
                    />
                    <Input
                        placeholder={'Due Date'}
                        inputStyle={styles.inputTextStyle}
                        containerStyle={styles.inputContainer}
                        onChangeText={(dueDate) => this.setState({dueDate: dueDate})}
                        leftIcon={
                            <Icon
                                name="calendar-o"
                                size={30}
                                color={colors.black50}
                            />
                        }
                    />
                </View>
                <View style={styles.workerCountDirection}>
                    <Text style={styles.workerCount}>Assign Workers ({authStore.user.workers.length})</Text>
                </View>

                <SelectMultiple
                    keyExtractor={this.keyExtractor}
                    rowStyle={styles.listContainer}
                    items={authStore.user.workers}
                    renderLabel={renderLabel}
                    selectedItems={this.state.selectedPeople}
                    onSelectionsChange={this.onSelectionsChange}/>
            </View>
        );
    }
}

export default AddProject;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    backButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.black50,
        width: 30,
        height: 30,
        borderRadius: 40,
    },
    workerCount: {
        fontFamily: fonts.avenirMedium,
        fontSize: 25,
        fontStyle: 'normal',
        letterSpacing: 0.08,
        color: colors.black,
    },
    workerCountDirection: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 25,
        marginBottom: 10,
        marginHorizontal: 30,
    },

    listContainer: {
        marginHorizontal: 10,
        marginVertical: 4,
        backgroundColor: colors.white,
        borderRadius: 15,
    },
    inputContainer: {
        marginVertical: 5,
    },
    inputTextStyle: {
        marginTop: 5,
        marginLeft: 10,
        width: 100,
        fontSize: 20,
        fontFamily: fonts.avenirMedium,
        letterSpacing: 0.06,
    },
    inputsDirection: {
        marginTop: 30,
    },
    topButtons: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 25,
        marginHorizontal: 20,
    },
    saveButton: {
        marginTop: 20,
        marginRight: 25,
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 25,
        borderWidth: 2,
        width: 150,
    },
    saveButtonText: {
        marginLeft: 10,
        fontSize: 15,
        fontFamily: fonts.avenirMedium,
        color: colors.white,
    },
});
