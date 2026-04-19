import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

const Pagination = ({ currentPage, totalPages, onChangePage }) => {
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            onChangePage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onChangePage(currentPage + 1);
        }
    };

    return (
        <View style={styles.paginationContainer}>
            <TouchableOpacity
                style={[
                    styles.paginationButton,
                    currentPage === 1 && styles.disabledButton,
                ]}
                onPress={handlePreviousPage}
                disabled={currentPage === 1}>
                <Text style={styles.buttonText}>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.pageText}>{`${currentPage} / ${totalPages}`}</Text>
            <TouchableOpacity
                style={[
                    styles.paginationButton,
                    currentPage === totalPages && styles.disabledButton,
                ]}
                onPress={handleNextPage}
                disabled={currentPage === totalPages}>
                <Text style={styles.buttonText}>{'>'}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    paginationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    paginationButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginHorizontal: 5,
    },
    disabledButton: {
        opacity: 0.5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    pageText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Pagination;
