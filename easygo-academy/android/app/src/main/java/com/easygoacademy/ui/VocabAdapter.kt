package com.easygoacademy.ui

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.easygoacademy.R
import com.easygoacademy.data.VocabEntity

class VocabAdapter : ListAdapter<VocabEntity, VocabAdapter.VH>(DIFF) {

    companion object {
        val DIFF = object : DiffUtil.ItemCallback<VocabEntity>() {
            override fun areItemsTheSame(oldItem: VocabEntity, newItem: VocabEntity) = oldItem.id == newItem.id
            override fun areContentsTheSame(oldItem: VocabEntity, newItem: VocabEntity) = oldItem == newItem
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): VH {
        val v = LayoutInflater.from(parent.context).inflate(R.layout.item_vocab, parent, false)
        return VH(v)
    }

    override fun onBindViewHolder(holder: VH, position: Int) {
        val item = getItem(position)
        holder.word.text = item.word
        holder.trans.text = item.translation
    }

    class VH(view: View) : RecyclerView.ViewHolder(view) {
        val word: TextView = view.findViewById(R.id.tv_word)
        val trans: TextView = view.findViewById(R.id.tv_translation)
    }
}
