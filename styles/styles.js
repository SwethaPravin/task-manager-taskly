
import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  containerSplashScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleSplashScreen: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    marginTop: 12,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  viewOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffebda',
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffebda',
  },
  headerContainer: {
    marginBottom: 20,
    backgroundColor: '#ffebda',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 300,
    margin: 10,
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#ffebda',
  },
  addTaskForm: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#ffebda',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor: '#ffebda',
  },

  datePickerButton: {
    height: 0,
    borderColor: '#ccc',
    // borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  datePickerText: {
    color: 'black',
    fontWeight: 'bold',
  },

  buttonContainer: {
    flex: 1, 
    justifyContent: 'flex-end', 
    marginBottom: 10,
  },
  button: {
    height: 40,
    borderColor: '#ed7e38',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8786b',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  taskListContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fcf6f0',
  },
  pickerContainer: {
    flexDirection: 'row', alignItems: 'center', marginVertical: 10 
  },
  picker: {
    flex: 2,
    backgroundColor: '#ffebda',
  },
  taskItemContainer: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#f5a39a',
    padding: 5,
    borderRadius: 5,
    width: 70,
    alignItems: 'center',
  },
  deleteText: {
    color: 'black',
  },
  taskButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  taskItem: { 
    padding: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#ccc',
    backgroundColor: 'white',
  },
  kanbanContainer: { 
    flex: 1,
    backgroundColor: '#ffebda',
    overflow: 'visible',
  },
  column: {
    width: width * 0.8, // 80% of screen width per column
    marginHorizontal: 5,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    elevation: 2, // Android shadow
    overflow: 'visible',
  },
  columnHeader: { 
    fontSize: 18, 
    fontWeight: 500, 
    marginBottom: 10, 
    textAlign: 'center',
    backgroundColor: '#f8786b',
    borderRadius: 5,
    color: 'black',
    padding: 5,
  },
  taskList: { 
    flexGrow: 0,
    backgroundColor: 'white',
    overflow:'visible'
  },
  taskCard: {
    padding: 10,
    backgroundColor: '#f5a39a',
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    zIndex: 1,
  },
  taskTitle: { 
    fontSize: 16, 
    fontWeight: 500,
    backgroundColor: '#f5a39a',
  },
});

export default styles;