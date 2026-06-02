package com.easygoacademy.ui

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.easygoacademy.R
import com.easygoacademy.data.AppDatabase
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.launch

class VocabListActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_vocab_list)

        val rv = findViewById<RecyclerView>(R.id.rv_vocab)
        val adapter = VocabAdapter()
        rv.layoutManager = LinearLayoutManager(this)
        rv.adapter = adapter

        val db = AppDatabase.getInstance(this)
        lifecycleScope.launch {
            db.vocabDao().allWords().collect { list ->
                adapter.submitList(list)
            }
        }
    }
}
