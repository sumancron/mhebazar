'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

type ProductDetailField = { key: string; value: string }

type SubcategoryFormData = {
  category: string
  name: string
  description?: string
  meta_title?: string
  meta_description?: string
  sub_image?: FileList
  sub_banner?: FileList
  product_details: ProductDetailField[]
}

type Category = {
  id: number
  name: string
}

export default function SubcategoryForm() {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SubcategoryFormData>({
    defaultValues: {
      product_details: [{ key: '', value: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'product_details',
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    axios.get('http://localhost:8000/api/categories/').then((res) => {
      setCategories(res.data)
    })
  }, [])

  const onSubmit = async (data: SubcategoryFormData) => {
    const formData = new FormData()
    formData.append('category', data.category)
    formData.append('name', data.name)
    if (data.description) formData.append('description', data.description)
    if (data.meta_title) formData.append('meta_title', data.meta_title)
    if (data.meta_description) formData.append('meta_description', data.meta_description)
    if (data.sub_image?.[0]) formData.append('sub_image', data.sub_image[0])
    if (data.sub_banner?.[0]) formData.append('sub_banner', data.sub_banner[0])
    formData.append('product_details', JSON.stringify(data.product_details))

    try {
      setIsSubmitting(true)
      await axios.post('http://localhost:8000/api/subcategories/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setMessage('Subcategory created successfully!')
    } catch (error: any) {
      console.error(error)
      setMessage('Failed to create subcategory.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label>Category</Label>
            <Select onValueChange={(val) => setValue('category', val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-red-500 text-sm">Category is required</p>}
          </div>

          <div>
            <Label>Name</Label>
            <Input {...register('name', { required: true })} />
            {errors.name && <p className="text-red-500 text-sm">Name is required</p>}
          </div>

          <div>
            <Label>Description</Label>
            <Textarea {...register('description')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Meta Title</Label>
              <Input {...register('meta_title')} />
            </div>
            <div>
              <Label>Meta Description</Label>
              <Input {...register('meta_description')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Subcategory Image</Label>
              <Input type="file" {...register('sub_image')} />
            </div>
            <div>
              <Label>Subcategory Banner</Label>
              <Input type="file" {...register('sub_banner')} />
            </div>
          </div>

          <div>
            <Label className="text-lg">Product Details Fields</Label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 mb-2">
                <Input placeholder="Key" {...register(`product_details.${index}.key`)} />
                <Input placeholder="Value" {...register(`product_details.${index}.value`)} />
                <Button type="button" variant="destructive" onClick={() => remove(index)}>
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" onClick={() => append({ key: '', value: '' })}>
              Add Field
            </Button>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Create Subcategory'}
          </Button>

          {message && <p className="text-sm text-center mt-2">{message}</p>}
        </form>
      </CardContent>
    </Card>
  )
}