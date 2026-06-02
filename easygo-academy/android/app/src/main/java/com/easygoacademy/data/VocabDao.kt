package com.easygoacademy.data

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface VocabDao {
    @Insert
    suspend fun insert(word: VocabEntity): Long

    @Query("SELECT * FROM vocabulary ORDER BY addedAtUtc DESC")
    fun allWords(): Flow<List<VocabEntity>>

    @Query("DELETE FROM vocabulary WHERE id = :id")
    suspend fun deleteById(id: Long)
}
