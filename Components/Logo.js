import { Image, Text, View, StyleSheet} from 'react-native';
import logo from '../assets/logo.png';

const Logo = () => {
    return (

            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor:"#111211"}}>
                <Image source={logo} style={{width: 100, height: 80}} />
                <Text style={styles.Title}>Filmatic</Text>
            </View>
    );
}

const styles = StyleSheet.create({
    Title: {
        padding: 10,
        fontSize: 30,
        color: 'white',
        marginTop: 25,
        fontFamily: 'Bukhari-Script',
      },
});

export default Logo;